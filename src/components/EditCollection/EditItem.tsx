import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import Colors from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CategoryListItem from '../SearchScreen/CategoryListItem';

const EditItem = ({ index, onRemove, onItemChange, categories, colors, sizes, gender, title, description, price, images, selectedCategory, selectedSubcategory, selectedColor, selectedSizes }) => {
  const [localTitle, setLocalTitle] = useState(title || '');
  const [localDescription, setLocalDescription] = useState(description || '');
  const [localPrice, setLocalPrice] = useState(price || '');
  const [localImages, setLocalImages] = useState(images || [null, null, null, null, null]);
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory || null);
  const [localSelectedSubcategory, setLocalSelectedSubcategory] = useState(selectedSubcategory || null);
  const [localSelectedColor, setLocalSelectedColor] = useState(selectedColor || null);
  const [localSelectedSizes, setLocalSelectedSizes] = useState(selectedSizes || []);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    onItemChange(index, {
      title: localTitle,
      description: localDescription,
      price: localPrice,
      images: localImages,
      selectedCategory: localSelectedCategory,
      selectedSubcategory: localSelectedSubcategory,
      selectedColor: localSelectedColor,
      selectedSizes: localSelectedSizes,
    });
  }, [localTitle, localDescription, localPrice, localImages, localSelectedCategory, localSelectedSubcategory, localSelectedColor, localSelectedSizes]);

  const pickImage = async (imageIndex) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...localImages];
      newImages[imageIndex] = result.assets[0].uri;
      setLocalImages(newImages);
    }
  };

  const removeImage = (imageIndex) => {
    const newImages = [...localImages];
    newImages[imageIndex] = null;
    setLocalImages(newImages);
  };

  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  const handleSubcategoryPress = () => {
    if (!localSelectedCategory) {
      alert('Gelieve eerst een categorie te selecteren');
      return;
    }
    setShowSubcategoryModal(true);
  };

  const handleColorPress = () => {
    setShowColorModal(true);
  };

  const handleSizePress = () => {
    if (!localSelectedSubcategory) {
      alert('Gelieve eerst een subcategorie te selecteren');
      return;
    }
    setShowSizeModal(true);
  };

  const handleSizeSelect = (size) => {
    if (localSelectedSizes.some(s => s.id === size.id)) {
      setLocalSelectedSizes(localSelectedSizes.filter((s) => s.id !== size.id));
    } else {
      setLocalSelectedSizes([...localSelectedSizes, size]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artikel Titel {index + 1}</Text>
      <TextInput style={styles.input} value={localTitle} onChangeText={setLocalTitle} />
      <Text style={styles.label}>Voeg max. 5 foto’s toe:</Text>
      <View style={styles.photosContainer}>
        {localImages.map((image, imageIndex) => (
          <TouchableOpacity
            key={imageIndex}
            onPress={() => (image ? removeImage(imageIndex) : pickImage(imageIndex))}
          >
            {image ? (
              <View style={styles.photoWrapper}>
                <Image source={{ uri: image }} style={styles.photoPlaceholder} />
                <Ionicons name="close-circle" size={24} color={Colors.blueIris} style={styles.deleteIcon} />
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="add-circle" size={24} color="gray" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Beschrijving *</Text>
      <TextInput style={styles.input} value={localDescription} onChangeText={setLocalDescription} multiline />
      <Text style={styles.label}>Prijs *</Text>
      <TextInput style={styles.input} value={localPrice} onChangeText={setLocalPrice} keyboardType="numeric" placeholder='€'/>
      <CategoryListItem searchitem={{ name: localSelectedCategory ? localSelectedCategory.name : 'Categorie' }} onPress={handleCategoryPress} />
      <CategoryListItem searchitem={{ name: localSelectedSubcategory ? localSelectedSubcategory.name : 'Subcategorie' }} onPress={handleSubcategoryPress} />
      <CategoryListItem searchitem={{ name: localSelectedColor ? localSelectedColor.name : 'Kleur' }} onPress={handleColorPress} />
      <CategoryListItem searchitem={{ name: localSelectedSizes.length ? localSelectedSizes.map(s => s.name).join(', ') : 'Maten' }} onPress={handleSizePress} />
      <TouchableOpacity style={styles.button} onPress={() => onRemove(index)}>
        <Text style={styles.buttonText}>Verwijder</Text>
      </TouchableOpacity>

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent={true}>
        <View style={styles.modalContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setLocalSelectedCategory(item);
                  setShowCategoryModal(false);
                  setLocalSelectedSubcategory(null);  
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCategoryModal(false)}>
            <Text style={styles.modalCloseButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Subcategory Modal */}
      <Modal visible={showSubcategoryModal} transparent={true}>
        <View style={styles.modalContainer}>
          <FlatList
            data={categories.find(cat => cat.id === localSelectedCategory?.id)?.subcategories.filter(sub => sub.gender === gender) || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setLocalSelectedSubcategory(item);
                  setShowSubcategoryModal(false);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSubcategoryModal(false)}>
            <Text style={styles.modalCloseButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Color Modal */}
      <Modal visible={showColorModal} transparent={true}>
        <View style={styles.modalContainer}>
          <FlatList
            data={colors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setLocalSelectedColor(item);
                  setShowColorModal(false);
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowColorModal(false)}>
            <Text style={styles.modalCloseButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Size Modal */}
      <Modal visible={showSizeModal} transparent={true}>
        <View style={styles.modalContainer}>
          <FlatList
            data={sizes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSizeSelect(item)}
              >
                <Text style={{ color: localSelectedSizes.some(s => s.id === item.id) ? Colors.blueIris : 'black' }}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowSizeModal(false)}>
            <Text style={styles.modalCloseButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 5,
    borderBottomColor: '#ddd',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  photoPlaceholder: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  button: {
    backgroundColor: Colors.white,
    padding: 10,
  },
  buttonText: {
    color: Colors.blueIris,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 300,
    paddingBottom: 300,
  },
  modalContent: {
    width: wp('80%'),
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalItem: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.blueIris,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default EditItem;
