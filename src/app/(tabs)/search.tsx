import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import items from '../../../assets/data/clothingItems';
import { Text, View, ScrollView, Pressable } from 'react-native';
import SearchBar from '@/src/components/SearchBar';
import Colors from '@/src/constants/Colors';
import SearchCategoryList from '@/src/components/SearchScreen/SearchCategoryList';

export default function Search() {
  const [selectedTab, setSelectedTab] = useState('Dames');

  // Filter items based on selected tab
  const filteredItems = items.filter(item => item.category === selectedTab);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, selectedTab === 'Dames' && styles.activeTab]}
          onPress={() => setSelectedTab('Dames')}
        >
          <Text style={[styles.tabText, selectedTab === 'Dames' && styles.activeTabText]}>Dames</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'Heren' && styles.activeTab]}
          onPress={() => setSelectedTab('Heren')}
        >
          <Text style={[styles.tabText, selectedTab === 'Heren' && styles.activeTabText]}>Heren</Text>
        </Pressable>
      </View>
      <SearchCategoryList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: 'PPMonumentExtended-Regular',

  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.blueIris,
  },
  activeTabText: {
    color: Colors.blueIris,
  },
  searchBarContainer: {
    padding: 20,
  },
});
