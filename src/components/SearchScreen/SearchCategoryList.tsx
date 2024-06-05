// src/app/(tabs)/search/CategoryList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import CategoryListItem from './CategoryListItem';
import { Category } from '@/src/types';

const categories: Category[] = [
  {
    name: 'Kleding',
    subcategories: [
      { name: 'Alle' },
      { name: 'Jurken' },
      { name: 'Tops' },
      { name: 'Korte Broeken' },
      { name: 'Rokken' },
      { name: 'Co-ords' },
      { name: 'Zwemkleding & Strandkleding' },
      { name: 'Blazers' },
      { name: 'Blouses' },
      { name: 'Cargo Broeken' },
      { name: 'Jassen & Jacks' },
      { name: 'Truien & Sweatshirts' },
      { name: 'Jeans' },
      { name: 'Truien & Vesten' },
      { name: 'Jumpsuits & Speelpakken' },
      { name: 'Lingerie & Nachtkleding' },
      { name: "Pyjama's" },
      { name: 'Shirts' },
      { name: 'Sportkleding' },
      { name: 'Kostuums & Kleermakerijen' },
      { name: 'Trainingspakken & Joggers' },
      { name: 'Broeken & Leggings' },
    ],
  },
  {
    name: 'Schoenen',
    subcategories: [
      { name: 'Trainers' },
      { name: 'Sandalen' },
      { name: 'Hakken' },
      { name: 'Sandalen met hak' },
      { name: 'Platte schoenen' },
      { name: 'Balletpumps' },
      { name: 'Laarzen' },
      { name: 'Platte Sandalen' },
      { name: 'Loafers' },
    ],
  },
  {
    name: 'Accessoires',
    subcategories: [
      { name: 'Zonnebrillen' },
      { name: 'Haaraccessoires' },
      { name: 'Hoeden' },
      { name: "Sokken & Panty's" },
      { name: 'Riemen' },
      { name: 'Sieraden' },
      { name: 'Mutsen' },
    ],
  },
  {
    name: 'Tassen',
    subcategories: [
      { name: 'Tassen' },
      { name: 'Tote Tassen' },
      { name: 'Schoudertassen' },
      { name: 'Clutchs' },
      { name: 'Portemonnees' },
    ],
  },
  { name: 'Winkels' },
];

const CategoryList = () => {
  const router = useRouter();

  const handlePress = (category: Category) => {
    if (category.name === 'Winkels') {
      router.push('/search/shops/shopsscreen');
    } else {
      router.push({
        pathname: '/search/subcategories/subcategoriesscreen',
        params: { category: category.name, subcategories: JSON.stringify(category.subcategories) },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Categorieën',
          headerShown: true,
        }}
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <CategoryListItem searchitem={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});

export default CategoryList;
