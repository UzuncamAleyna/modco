import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import ProductListItem from '@/src/components/ProductListItem';
import { supabase } from '@/src/lib/supabase';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const CollectionItems = () => {
  const { id } = useLocalSearchParams();
  const [collection, setCollection] = useState(null);
  const [sortedItems, setSortedItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCollectionItems = async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          name,
          fashion_items (
            id,
            title,
            price,
            shops (name),
            fashion_item_photos (url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching collection items:', error);
      } else {
        setCollection(data);
        setSortedItems(data.fashion_items);
      }
    };
    fetchCollectionItems();
  }, [id]);

  const sortItems = (criteria) => {
    let sortedArray = [...sortedItems];
    if (criteria === 'price') {
      sortedArray.sort((a, b) => a.price - b.price);
    } else if (criteria === 'name') {
      sortedArray.sort((a, b) => a.title.localeCompare(b.title));
    }
    setSortedItems(sortedArray);
  };

  if (!collection) {
    return (
      <View style={styles.container}>
        <Text>Collectie niet gevonden</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          title: collection.name,
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
      <View style={styles.filterSortContainer}>
      <Link href="/home/sort/sortscreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sorteren op</Text>
            <Icon name="chevron-down" size={16} color={Colors.black} />
          </TouchableOpacity>
        </Link>
        <TouchableOpacity style={styles.button} onPress={() => sortItems('price')}>
          <Text style={styles.buttonText}>Filter</Text>
          <Icon name="filter" size={16} color={Colors.black} />
        </TouchableOpacity>
      </View>
      <Text style={styles.itemCount}>{sortedItems.length} artikelen gevonden</Text>
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <ProductListItem item={item} />}
        contentContainerStyle={styles.list}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginRight: 5,
  },
  itemCount: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  list: {
    paddingHorizontal: 20,
  },
});

export default CollectionItems;

