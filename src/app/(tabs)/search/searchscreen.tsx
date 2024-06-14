import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import items from '../../../../assets/data/clothingItems';
import SearchBar from '@/src/components/SearchBar';
import Colors from '@/src/constants/Colors';
import SearchCategoryList from '@/src/components/SearchScreen/SearchCategoryList';
import { Stack } from 'expo-router';

export default function Search() {
  const [selectedTab, setSelectedTab] = useState('Dames');

  // Filter items based on selected tab
  const filteredItems = items.filter(item => item.category === selectedTab);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ 
          headerTitle: 'Zoeken',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
        }}
      />
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.searchBarContainer}>
              <SearchBar value={undefined} onChangeText={undefined} />
            </View>
            <SearchCategoryList />
          </>
        }
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarContainer: {
    padding: 20,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
});
