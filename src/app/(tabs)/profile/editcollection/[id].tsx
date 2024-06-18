import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import EditItem from '../../../../components/EditCollection/EditItem';
import { supabase } from '@/src/lib/supabase';
import RadioButton from '../../../../components/RadioButton/RadioButton';
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const EditCollectionScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [collectionTitle, setCollectionTitle] = useState('');
  const [items, setItems] = useState([]);
  const [gender, setGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetchCollectionDetails();
    fetchCategories();
    fetchColors();
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [items, gender]);

  const fetchCollectionDetails = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        id,
        name,
        gender,
        fashion_items (
          id,
          title,
          description,
          price,
          subcategory_id,
          fashion_item_photos (url),
          fashion_item_colors (color_id),
          fashion_item_sizes (size_id)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching collection details:', error);
    } else {
      setCollectionTitle(data.name);
      setGender(data.gender);
      const fashionItems = data.fashion_items.map(item => ({
        ...item,
        images: item.fashion_item_photos.map(photo => photo.url),
        selectedCategory: categories.find(cat => cat.subcategories.some(sub => sub.id === item.subcategory_id)),
        selectedSubcategory: categories.flatMap(cat => cat.subcategories).find(sub => sub.id === item.subcategory_id),
        selectedColor: colors.find(color => color.id === item.fashion_item_colors[0]?.color_id),
        selectedSizes: sizes.filter(size => item.fashion_item_sizes.some(itemSize => itemSize.size_id === size.id))
      }));
      setItems(fashionItems);
    }
  };

  console.log('items', items);

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

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = async (index) => {
    const itemToRemove = items[index];
    if (itemToRemove.id) {
      const { error } = await supabase
        .from('fashion_items')
        .delete()
        .eq('id', itemToRemove.id);
      if (error) {
        console.error('Error removing item:', error.message);
        Alert.alert('Error', 'Kon het artikel niet verwijderen');
        return;
      }
    }
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, newItem) => {
    const updatedItems = [...items];
    updatedItems[index] = newItem;
    setItems(updatedItems);
  };

  const handleSave = async () => {
    try {
      // Update collection details
      const { error: updateCollectionError } = await supabase
        .from('collections')
        .update({ name: collectionTitle, gender })
        .eq('id', id);

      if (updateCollectionError) {
        throw updateCollectionError;
      }

      // Update items
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const { error: updateItemError } = await supabase
            .from('fashion_items')
            .update({
              title: item.title,
              description: item.description,
              price: item.price,
              subcategory_id: item.selectedSubcategory.id,
            })
            .eq('id', item.id);

          if (updateItemError) {
            throw updateItemError;
          }

          // Update images, colors, and sizes
          await updateItemDetails(item);
        } else {
          // Insert new item
          const { data: newItemData, error: insertItemError } = await supabase
            .from('fashion_items')
            .insert({
              collection_id: id,
              title: item.title,
              description: item.description,
              price: item.price,
              subcategory_id: item.selectedSubcategory.id,
            })
            .select()
            .single();

          if (insertItemError) {
            throw insertItemError;
          }

          // Update images, colors, and sizes
          await updateItemDetails({ ...item, id: newItemData.id });
        }
      }

      Alert.alert('Succes', 'De collectie is bijgewerkt');
      router.back();
    } catch (error) {
      console.error('Error saving collection:', error.message);
      Alert.alert('Error', 'Kon de collectie niet bijwerken');
    }
  };

  const updateItemDetails = async (item) => {
    // Update images
    await supabase
      .from('fashion_item_photos')
      .delete()
      .eq('fashion_item_id', item.id);

    const imagePromises = item.images.map(async (imageUri, imageIndex) => {
      if (imageUri) {
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const imageName = `${item.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from('fashion_item_photos')
          .upload(imageName, decode(base64), { contentType: 'image' });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('fashion_item_photos')
          .getPublicUrl(imageName);

        await supabase
          .from('fashion_item_photos')
          .insert({ fashion_item_id: item.id, url: publicUrlData.publicUrl, order: imageIndex + 1 });
      }
    });

    await Promise.all(imagePromises);

    // Update colors
    await supabase
      .from('fashion_item_colors')
      .delete()
      .eq('fashion_item_id', item.id);

    await supabase
      .from('fashion_item_colors')
      .insert({ fashion_item_id: item.id, color_id: item.selectedColor.id });

    // Update sizes
    await supabase
      .from('fashion_item_sizes')
      .delete()
      .eq('fashion_item_id', item.id);

    const sizePromises = item.selectedSizes.map(size =>
      supabase
        .from('fashion_item_sizes')
        .insert({ fashion_item_id: item.id, size_id: size.id })
    );

    await Promise.all(sizePromises);
  };

  const handleDeleteCollection = async () => {
    Alert.alert(
      'Collectie verwijderen',
      'Bent u zeker dat u deze collectie wilt verwijderen?',
      [
        {
          text: 'Annuleren',
          style: 'cancel',
        },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('collections')
              .delete()
              .eq('id', id);

            if (error) {
              console.error('Error deleting collection:', error.message);
              Alert.alert('Er is iets misgegaan', 'Kon collectie niet verwijderen. Probeer het opnieuw.');
            } else {
              Alert.alert('Collectie verwijderd', 'Je collectie is succesvol verwijderd.');
              router.back();
            }
          },
        },
      ],
      { cancelable: false }
    );
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
        <EditItem
          key={index}
          index={index}
          categories={categories}
          colors={colors}
          sizes={sizes}
          onRemove={removeItem}
          onItemChange={handleItemChange}
          gender={gender}
          {...item}
        />
      ))}
      <TouchableOpacity style={styles.itemButton} onPress={addItem}>
        <Text style={styles.itemBtnText}>Artikel toevoegen</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.collectionButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Collectie bijwerken</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteCollectionButton} onPress={handleDeleteCollection}>
        <Text style={styles.deleteCollectionButtonText}>Collectie verwijderen</Text>
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
  deleteCollectionButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteCollectionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
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

export default EditCollectionScreen;
