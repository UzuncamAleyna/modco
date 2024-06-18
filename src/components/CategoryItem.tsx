import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export type CategoryItemType = {
  id: string;
  name: string;
  image: string;
  sales_count: number;
};

type CategoryItemProps = {
  categoryitem: CategoryItemType;
  onPress: () => void;
};

const CategoryItem = ({ categoryitem, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: categoryitem.image }} style={styles.image} />
      <Text style={styles.title}>{categoryitem.name}</Text>
    </TouchableOpacity>
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
