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
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
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
