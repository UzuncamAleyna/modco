import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import CategoryListItem from '../SearchScreen/CategoryListItem';

const SellItem = ({ index, onRemove }) => {
  const handleCategoryPress = () => {
    console.log('Category pressed');
    // Navigate to the category selection screen
  };

  const handleColorPress = () => {
    console.log('Color pressed');
    // Navigate to the color selection screen
  };

  const handleStylePress = () => {
    console.log('Style pressed');
    // Navigate to the style selection screen
  };

  const handleSizePress = () => {
    console.log('Size pressed');
    // Navigate to the size selection screen
  };

  const handleMaterialPress = () => {
    console.log('Material pressed');
    // Navigate to the material selection screen
  };

  const handleLengthPress = () => {
    console.log('Length pressed');
    // Navigate to the length selection screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artikel Titel {index + 1}</Text>
      <TextInput style={styles.input} />
      <Text style={styles.label}>Voeg max. 5 foto’s toe:</Text>
      <View style={styles.photosContainer}>
        <View style={styles.photoPlaceholder} />
        <View style={styles.photoPlaceholder} />
        <View style={styles.photoPlaceholder} />
        <View style={styles.photoPlaceholder} />
        <View style={styles.photoPlaceholder} />
      </View>
      <Text style={styles.label}>Beschrijving *</Text>
      <TextInput style={styles.input} multiline />
      <Text style={styles.label}>Prijs *</Text>
      <TextInput style={styles.input} keyboardType="numeric" />

      <CategoryListItem searchitem={{ name: 'Categorie' }} onPress={handleCategoryPress} />
      <CategoryListItem searchitem={{ name: 'Kleur' }} onPress={handleColorPress} />
      <CategoryListItem searchitem={{ name: 'Stijl' }} onPress={handleStylePress} />
      <CategoryListItem searchitem={{ name: 'Maat' }} onPress={handleSizePress} />
      <CategoryListItem searchitem={{ name: 'Materiaal' }} onPress={handleMaterialPress} />
      <CategoryListItem searchitem={{ name: 'Lengte' }} onPress={handleLengthPress} />
      <TouchableOpacity style={styles.button} onPress={() => onRemove(index)}>
        <Text style={styles.buttonText}>Verwijder</Text>
    </TouchableOpacity>
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
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
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
});

export default SellItem;
