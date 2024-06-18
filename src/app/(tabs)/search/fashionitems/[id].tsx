import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';
import Colors from '@/src/constants/Colors';
import ProductListItem from '../../../../components/ProductListItem';
import { supabase } from '@/src/lib/supabase';

const fetchFashionItems = async (subcategoryId: string) => {
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
  const { subcategoryId, subcategoryName } = useLocalSearchParams();
  const [fashionItems, setFashionItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!subcategoryId) {
      console.error('Invalid subcategoryId:', subcategoryId);
      return;
    }

    const fetchItems = async () => {
      const items = await fetchFashionItems(subcategoryId as string);
      setFashionItems(items);
    };

    fetchItems();
  }, [subcategoryId]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: subcategoryName as string,
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerLeft}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={fashionItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ProductListItem item={item} />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    margin: 10,
    maxWidth: '42%',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerLeft: {
    marginLeft: 10,
  },
});

export default FashionItemList;
