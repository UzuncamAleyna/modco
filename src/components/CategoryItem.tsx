// CategoryItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CategoryItemType } from '../types';


type CategoryItemProps = {
    categoryitem: CategoryItemType;
}

const CategoryItem = ({categoryitem}: CategoryItemProps) => {
  return (
    <View style={styles.container}>
      <Image source={categoryitem.image} style={styles.image} />
      <Text style={styles.title}>{categoryitem.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 143,
    height: 219,
    borderRadius: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default CategoryItem;
