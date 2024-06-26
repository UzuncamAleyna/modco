import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import ProductListItem from '@/src/components/ProductListItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '@/src/lib/supabase';

const SectionScreen = () => {
  const router = useRouter();
  const { section } = useLocalSearchParams();
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          section,
          shops(name),
          fashion_item_photos(url)
        `);

      if (error) {
        console.error('Error fetching items:', error.message);
      } else {
        const filtered = data.filter(item => item.section === section);
        setFilteredItems(filtered);
      }
    };
    fetchItems();
  }, [section]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          title: section.toString(),
          headerShown: true,
          headerTransparent: false,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
        <Link href="/home/filter/filterscreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Filter</Text>
            <Icon name="filter" size={16} color={Colors.black} />
          </TouchableOpacity>
        </Link>
      </View>
      <Text style={styles.itemCount}>{filteredItems.length} artikelen gevonden</Text>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => <ProductListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
  backButton: {
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default SectionScreen;
