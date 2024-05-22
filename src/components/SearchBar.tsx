import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Zoek..." />
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
  },
  input: {
    padding: 10,
  },
});

export default SearchBar;