// TopCategories.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import CategoryItem from './CategoryItem';
import categories from '../../assets/data/itemCategories';
import Colors from '../constants/Colors';

type TopcategoriesSectionProps = {
    title: string;
    items: Array<any>; 
  };

const TopCategories: React.FC<TopcategoriesSectionProps> = ({title}) => {
  return (
    <View style={styles.mainContainer}>
    <Text style={styles.title}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((category) => (
        <CategoryItem key={category.id} categoryitem={category} />
      ))}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
    title: {
        fontSize: 20,
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
        marginBottom: 10,
    },
    mainContainer: {
        marginBottom: 20,
        backgroundColor: Colors.lightPurple,
        padding: 20,
        borderRadius: 5,
    },
});

export default TopCategories;
