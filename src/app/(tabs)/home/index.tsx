import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import Colors from '@/src/constants/Colors';
import items from '../../../../assets/data/clothingItems';
import ProductListSection from '@/src/components/ProductListSection';
import SearchBar from '@/src/components/SearchBar';
import TopCategories from '@/src/components/TopCategories';
import categories from '../../../../assets/data/itemCategories';
import Banner from '@/src/components/Banner';
import Fonts from '@/src/constants/Fonts';
import { Stack } from 'expo-router';


export default function Home() {
  const [selectedTab, setSelectedTab] = useState('Dames');

  // Filter items based on selected tab
  const filteredItems = items.filter(item => item.category === selectedTab);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{ 
          headerTitle:'MODCO', 
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 20,
          }, 
        }}
      />
      <SearchBar value={undefined} onChangeText={undefined} />
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
      <Banner />
      <TopCategories title={'TOPCATEGORIEËN'} items={categories} />
      <ProductListSection title={'Nieuw'} items={filteredItems} />
      <ProductListSection title={'Bestseller'} items={filteredItems} />
      <ProductListSection title={'Aanbiedingen'} items={filteredItems} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
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
});
