import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Colors from '@/src/constants/Colors';
import ProductListItem from '../../../../components/ProductListItem';
import { supabase } from '@/src/lib/supabase';

const fetchFashionItems = async (subcategoryId: string, gender: string) => {
  const { data, error } = await supabase
    .from('fashion_items')
    .select(`
      id,
      title,
      description,
      price,
      shops (name),
      fashion_item_photos (url)
    `)
    .eq('subcategory_id', subcategoryId);

  if (error) {
    console.error('Error fetching fashion items:', error.message);
    return [];
  }

  return data;
};

const FashionItemList = () => {
  const { subcategoryId, gender } = useLocalSearchParams();
  const [fashionItems, setFashionItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchFashionItems(subcategoryId as string, gender as string);
      setFashionItems(items);
    };

    fetchItems();
  }, [subcategoryId, gender]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Fashion Items',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
        }}
      />
      <FlatList
        data={fashionItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductListItem item={item} />
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

export default FashionItemList;
