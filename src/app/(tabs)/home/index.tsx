import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '@/src/constants/Colors';
import ProductListSection from '@/src/components/ProductListSection';
import SearchBar from '@/src/components/SearchBar';
import TopCategories from '@/src/components/TopCategories';
import Banner from '@/src/components/Banner';
import { Stack } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('Dames');
  const [newItems, setNewItems] = useState([]);
  const [bestsellerItems, setBestsellerItems] = useState([]);
  const [mostReviewedItems, setMostReviewedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data: subcategories, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('id')
        .eq('gender', selectedTab);

      if (subcategoryError) {
        throw new Error('Error fetching subcategories');
      }

      const subcategoryIds = subcategories.map(subcategory => subcategory.id);

      // Fetch the new fashion items
      const { data: newData, error: newError } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          shops(name),
          fashion_item_photos(url),
          reviews (rating)
        `)
        .in('subcategory_id', subcategoryIds)
        .order('created_at', { ascending: false })
        .limit(5); // Limit of 5 items for the New section

      if (newError) {
        throw new Error('Error fetching new items');
      }

      setNewItems(newData);

      // Fetch the most reviewed fashion items
      const { data: mostReviewedData, error: mostReviewedError } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          shops(name),
          fashion_item_photos(url),
          reviews (
            rating
          )
        `)
        .in('subcategory_id', subcategoryIds);

      if (mostReviewedError) {
        throw new Error('Error fetching most reviewed items');
      }

      // Filter out items without reviews
      const filteredMostReviewedItems = mostReviewedData.filter(item => item.reviews.length > 0);

      let processedMostReviewedItems = [];

      if (filteredMostReviewedItems.length > 0) {
        // Calculation of review count and average rating
        processedMostReviewedItems = filteredMostReviewedItems.map(item => {
          const reviewCount = item.reviews.length;
          const averageRating = item.reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;
          return { ...item, reviewCount, averageRating };
        });

        // Sort by review count and average rating
        processedMostReviewedItems.sort((a, b) => b.reviewCount - a.reviewCount || b.averageRating - a.averageRating);
      }

      setMostReviewedItems(processedMostReviewedItems);

      // Fetch the bestseller fashion items
      const { data: bestsellerData, error: bestsellerError } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          shops(name),
          fashion_item_photos(url)
        `)
        .in('subcategory_id', subcategoryIds)
        .order('sales_count', { ascending: false })
        .limit(5); // Limit of 5 items for the Bestseller section

      if (bestsellerError) {
        throw new Error('Error fetching bestseller items');
      }

      // Fallback: If no bestseller items are available, use the most reviewed items for Bestseller
      setBestsellerItems(bestsellerData.length > 0 ? bestsellerData : processedMostReviewedItems);

      // Fallback: If no most reviewed items are available, use the first 5 items from the Bestseller data
      setMostReviewedItems(processedMostReviewedItems.length > 0 ? processedMostReviewedItems : bestsellerData.slice(0, 5));

    } catch (error) {
      console.error(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [selectedTab])
  );

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'MODCO',
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
      <Banner selectedTab={selectedTab} />
      <TopCategories title={'TOPCATEGORIEËN'} selectedTab={selectedTab} />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.blueIris} />
      ) : (
        <>
          <ProductListSection title={'Nieuw'} items={newItems} selectedTab={selectedTab} />
          <ProductListSection title={'Bestseller'} items={bestsellerItems} selectedTab={selectedTab} />
          <ProductListSection title={'Meest Beoordeeld'} items={mostReviewedItems} selectedTab={selectedTab} />
        </>
      )}
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
