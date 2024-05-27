// src/app/(tabs)/search/SubcategoryList.tsx
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/src/constants/Colors';
import CategoryListItem from '../../../../components/SearchScreen/CategoryListItem';
import { Subcategory } from '@/src/types';

const SubcategoryList = () => {
  const { category, subcategories } = useLocalSearchParams();
  const parsedSubcategories: Subcategory[] = JSON.parse(subcategories as string);

  return (
    <View style={styles.container}>
        <Stack.Screen
            options={{
                title: Array.isArray(category) ? category[0] : category,
                headerShown: true,
            }}
        />
        <FlatList
            data={parsedSubcategories}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
                <CategoryListItem searchitem={item} onPress={() => console.log('Selected subcategory:', item.name)} />
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

export default SubcategoryList;
