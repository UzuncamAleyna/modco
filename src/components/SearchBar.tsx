import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';


const SearchBar = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={24} color={Colors.lightGrey} />
      <TextInput
        style={styles.input}
        placeholder="Zoek..."
        value={value}
        onChangeText={onChangeText}
      />    
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: Colors.lightGrey,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    padding: 10,
  },
});

export default SearchBar;