import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import Colors from '../../constants/Colors';
import CategoryListItem from '../SearchScreen/CategoryListItem';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const SellItem = ({ index, onRemove, onItemChange, categories, colors, sizes, gender }) => {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    onItemChange(index, { title, description, price, images, selectedCategory, selectedSubcategory, selectedColor, selectedSizes });
  }, [title, description, price, images, selectedCategory, selectedSubcategory, selectedColor, selectedSizes, gender]);

  const pickImage = async (imageIndex) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[imageIndex] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const removeImage = (imageIndex) => {
    const newImages = [...images];
    newImages[imageIndex] = null;
    setImages(newImages);
  };

  const handleCategoryPress = () => {
    setShowCategoryModal(true);
  };

  const handleSubcategoryPress = () => {
    if (!selectedCategory) {
      alert('Gelieve eerst een categorie te selecteren');
      return;
    }
    setShowSubcategoryModal(true);
  };

  const handleColorPress = () => {
    setShowColorModal(true);
  };

  const handleSizePress = () => {
    if (!selectedSubcategory) {
      alert('Gelieve eerst een subcategorie te selecteren');
      return;
    }
    setShowSizeModal(true);
  };

  const handleSizeSelect = (size) => {
    if (selectedSizes.some(s => s.id === size.id)) {
      setSelectedSizes(selectedSizes.filter((s) => s.id !== size.id));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artikel Titel {index + 1}</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Voeg max. 5 foto’s toe:</Text>
      <View style={styles.photosContainer}>
        {images.map((image, imageIndex) => (
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
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />
      <Text style={styles.label}>Prijs *</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder='€'/>
      <CategoryListItem searchitem={{ name: selectedCategory ? selectedCategory.name : 'Categorie' }} onPress={handleCategoryPress} />
      <CategoryListItem searchitem={{ name: selectedSubcategory ? selectedSubcategory.name : 'Subcategorie' }} onPress={handleSubcategoryPress} />
      <CategoryListItem searchitem={{ name: selectedColor ? selectedColor.name : 'Kleur' }} onPress={handleColorPress} />
      <CategoryListItem searchitem={{ name: selectedSizes.length ? selectedSizes.map(s => s.name).join(', ') : 'Maten' }} onPress={handleSizePress} />
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
                  setSelectedCategory(item);
                  setShowCategoryModal(false);
                  setSelectedSubcategory(null);  //Reset subcategory when category changes
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
            data={categories.find(cat => cat.id === selectedCategory?.id)?.subcategories.filter(sub => sub.gender === gender) || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedSubcategory(item);
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
                  setSelectedColor(item);
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
                <Text style={{ color: selectedSizes.some(s => s.id === item.id) ? Colors.blueIris : 'black' }}>{item.name}</Text>
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

export default SellItem;
