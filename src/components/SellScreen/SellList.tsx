import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import SellItem from './SellItem';
import Colors from '@/src/constants/Colors';
import RadioButton from '../RadioButton/RadioButton';

const SellList = () => {
  const [collectionTitle, setCollectionTitle] = useState('');
  const [items, setItems] = useState([]);
  const [gender, setGender] = useState('');

  const addItem = () => {
    setItems([...items, {}]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = () => {
    // Submit collection logic here
    console.log('Collection Submitted');
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
      {items.map((_, index) => (
        <SellItem key={index} index={index} onRemove={removeItem} />
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
