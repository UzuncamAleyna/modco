import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import CategoryListItem from './CategoryListItem';
import { supabase } from '@/src/lib/supabase';
import { Category } from '@/src/types';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>('Dames');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          subcategories ( id, name, gender )
        `);

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handlePress = (category: Category) => {
    const filteredSubcategories = category.subcategories.filter(
      subcategory => subcategory.gender === selectedGender
    );

    router.push({
      pathname: '/search/subcategories/subcategoriesscreen',
      params: { category: category.name, subcategories: JSON.stringify(filteredSubcategories) },
    });
  };

  const handleShopsPress = () => {
    router.push('/search/shops/shopsscreen');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Categorieën',
          headerShown: true,
        }}
      />
      <View style={styles.genderTabs}>
        <TouchableOpacity
          onPress={() => setSelectedGender('Dames')}
          style={[styles.genderTab, selectedGender === 'Dames' && styles.activeTab]}
        >
          <Text style={[styles.genderText, selectedGender === 'Dames' && styles.tabText]}>Dames</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedGender('Heren')}
          style={[styles.genderTab, selectedGender === 'Heren' && styles.activeTab]}
        >
          <Text style={[styles.genderText, selectedGender === 'Heren' && styles.tabText]}>Heren</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[...categories, { id: 'shops', name: 'Winkels', subcategories: [] }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item.id === 'shops' ? (
            <CategoryListItem searchitem={item} onPress={handleShopsPress} />
          ) : (
            <CategoryListItem searchitem={item} onPress={() => handlePress(item)} />
          )
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
  genderTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  genderTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.blueIris,
  },
  genderText: {
    color: Colors.grey,
    fontFamily: 'PPMonumentExtended-Regular',
    fontSize: 14,
  },
  tabText: {
    color: Colors.blueIris,
  },
});

export default CategoryList;
