import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SellItem from './SellItem';
import Colors from '@/src/constants/Colors';
import RadioButton from '../RadioButton/RadioButton';
import { supabase } from '@/src/lib/supabase';
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const SellList = () => {
  const [collectionTitle, setCollectionTitle] = useState('');
  const [items, setItems] = useState([]);
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [shopId, setShopId] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchShopId();
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [items, gender]);

  console.log('Items:', items);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        subcategories ( id, name, gender )
      `);

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data);
    }
  };

  console.log('Categories:', categories.map(category => category.name));

  const fetchColors = async () => {
    const { data, error } = await supabase
      .from('colors')
      .select('id, name');

    if (error) {
      console.error('Error fetching colors:', error);
    } else {
      setColors(data);
    }
  };

  const fetchSizes = async () => {
    const subcategoryIds = items.map(item => item.selectedSubcategory?.id).filter(Boolean);
    if (subcategoryIds.length > 0) {
      const { data, error } = await supabase
        .from('subcategory_sizes')
        .select(`
          size_id,
          sizes ( id, name )
        `)
        .in('subcategory_id', subcategoryIds);

      if (error) {
        console.error('Error fetching sizes:', error);
      } else {
        const allSizes = data.map(item => item.sizes);
        const uniqueSizes = Array.from(new Set(allSizes.map(size => size.id)))
          .map(id => allSizes.find(size => size.id === id));
        setSizes(uniqueSizes);
      }
    }
  };

  const fetchShopId = async () => {
    const { data, error } = await supabase
      .from('shops')
      .select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user.id)
      .single();

    if (error) {
      console.error('Error fetching shop ID:', error);
    } else {
      setShopId(data.id);
    }
  };

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, newItem) => {
    const updatedItems = [...items];
    updatedItems[index] = newItem;
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!collectionTitle) {
      console.error('Error: Collection title is not set');
      alert('Gelieve een collectie titel in te vullen');
      return;
    }

    if (!gender) {
      console.error('Error: Gender is not set');
      alert('Gelieve een geslacht te selecteren');
      return;
    }

    try {
      const { data: collectionData, error: collectionError } = await supabase
        .from('collections')
        .insert([{ name: collectionTitle, gender, shop_id: shopId }])
        .select()
        .single();

      if (collectionError) {
        console.error('Error inserting collection:', collectionError.message);
        throw new Error('Failed to insert collection');
      }

      const collectionId = collectionData.id;
      console.log('Collection created with ID:', collectionId);

      const itemPromises = items.map(async (item, index) => {
        if (!item.title || !item.description || !item.price) {
          console.error(`Error: Title, description, or price is missing for item at index ${index}`, item);
          throw new Error('Title, description, or price is missing');
        }

        if (!item.selectedSubcategory || !item.selectedSubcategory.id) {
          console.error(`Error: Subcategory is not selected for item at index ${index}`, item);
          throw new Error('Subcategory is not selected');
        }

        if (!item.selectedColor || !item.selectedColor.id) {
          console.error(`Error: Color is not selected for item at index ${index}`, item);
          throw new Error('Color is not selected');
        }

        if (!item.selectedSizes || item.selectedSizes.length === 0) {
          console.error(`Error: Sizes are not selected for item at index ${index}`, item);
          throw new Error('Sizes are not selected');
        }

        const { data: itemData, error: itemError } = await supabase
          .from('fashion_items')
          .insert([{
            collection_id: collectionId,
            shop_id: shopId,
            subcategory_id: item.selectedSubcategory.id,
            title: item.title,
            description: item.description,
            price: item.price,
          }])
          .select()
          .single();

        if (itemError) {
          console.error(`Error inserting item at index ${index}:`, itemError.message);
          throw new Error(`Failed to insert item at index ${index}`);
        }

        const itemId = itemData.id;
        console.log('Created fashion item with id:', itemId);

        const imagePromises = item.images.map(async (imageUri, imageIndex) => {
          if (imageUri) {
            try {
              console.log(`Fetching image from URI: ${imageUri}`);
              const response = await fetch(imageUri);

              if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
              }

              const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              const blob = await response.blob();
              console.log(`Blob type: ${blob.type}, Blob size: ${blob.size}`);

              if (blob.size === 0) {
                throw new Error('Blob size is 0');
              }

              const imageName = `${itemId}-${Date.now()}`;
              const bucketName = 'fashion_item_photos';
              console.log(`Uploading image to bucket: ${bucketName}, with name: ${imageName}`);

              const { data: uploadData, error: uploadError } =
                await supabase.storage
                  .from(bucketName)
                  .upload(imageName, decode(base64), { "contentType": "image" });
              if (uploadError) {
                console.error(`Error uploading image for item at index ${index}:`, uploadError.message);
                throw new Error('Failed to upload image');
              }

              const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(imageName);

              if (!publicUrlData) {
                throw new Error('Failed to get public URL for image');
              }

              const publicUrl = publicUrlData.publicUrl;
              console.log('Uploaded image with public URL:', publicUrl);

              const { error: photoError } = await supabase
                .from('fashion_item_photos')
                .insert([{ fashion_item_id: itemId, url: publicUrl, order: imageIndex + 1 }]);

              if (photoError) {
                console.error(`Error inserting photo URL for item at index ${index}:`, photoError.message);
                throw new Error('Failed to insert photo URL');
              }
            } catch (error) {
              console.error(`Error processing image for item at index ${index}:`, error.message);
              throw new Error('Failed to process image');
            }
          }
        });

        await Promise.all(imagePromises);

        const sizePromises = item.selectedSizes.map(async (size) => {
          const { error: sizeError } = await supabase
            .from('fashion_item_sizes')
            .insert([{ fashion_item_id: itemId, size_id: size.id }]);

          if (sizeError) {
            console.error(`Error inserting size for item at index ${index}:`, sizeError.message);
            throw new Error('Failed to insert size');
          }
        });

        await Promise.all(sizePromises);

        const colorPromise = await supabase
          .from('fashion_item_colors')
          .insert([{ fashion_item_id: itemId, color_id: item.selectedColor.id }]);

        if (colorPromise.error) {
          console.error(`Error inserting color for item at index ${index}:`, colorPromise.error.message);
          throw new Error('Failed to insert color');
        }
      });

      await Promise.all(itemPromises);
      console.log('Collection Submitted');
    } catch (error) {
      console.error('Error submitting collection:', error);
      alert(`Error submitting collection: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Collectie Titel</Text>
      <TextInput
        style={styles.input}
        value={collectionTitle}
        onChangeText={setCollectionTitle}
      />
      <Text style={styles.radioGroupLabel}>Selecteer geslacht:</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          selected={gender === 'Dames'}
          onPress={() => setGender('Dames')}
          label="Dames"
        />
        <RadioButton
          selected={gender === 'Heren'}
          onPress={() => setGender('Heren')}
          label="Heren"
        />
      </View>
      <View style={styles.separator} />
      {items.map((item, index) => (
        <SellItem
          key={index}
          index={index}
          categories={categories}
          colors={colors}
          sizes={sizes}
          onRemove={removeItem}
          onItemChange={handleItemChange}
          gender={gender}
        />
      ))}
      <TouchableOpacity style={styles.itemButton} onPress={addItem}>
        <Text style={styles.itemBtnText}>Artikel toevoegen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.collectionButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Collectie plaatsen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  itemButton: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  collectionButton: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  itemBtnText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  separator: {
    backgroundColor: '#ddd',
    height: 5,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioGroupLabel: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
  },
});

export default SellList;
