import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import ProductListItem from '@/src/components/ProductListItem';
import Icon from 'react-native-vector-icons/Octicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '@/src/lib/supabase';

const SectionPage = () => {
  const { title, selectedTab } = useLocalSearchParams();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!title || !selectedTab) {
      console.error('Section or selectedTab parameter is missing');
      return;
    }

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

        let query = supabase
          .from('fashion_items')
          .select(`
            id,
            title,
            description,
            price,
            shops(name),
            fashion_item_photos(url)
          `)
          .in('subcategory_id', subcategoryIds);

        if (title === 'Nieuw') {
          query = query.order('created_at', { ascending: false });
        } else if (title === 'Bestseller') {
          query = query.order('sales_count', { ascending: false });
        } else if (title === 'Meest Beoordeeld') {
          query = query.order('average_rating', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          throw new Error('Error fetching items');
        }

        setItems(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [title, selectedTab]);

  if (!title || !selectedTab) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sectie niet gevonden</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen
        options={{
          title: title ? title.toString() : 'Section',
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
      <Text style={styles.itemCount}>{items.length} artikelen gevonden</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.blueIris} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductListItem item={item} />}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.blueIris,
    fontFamily: 'Roboto-Regular',
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

export default SectionPage;
