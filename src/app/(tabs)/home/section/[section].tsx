import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import items from '../../../../../assets/data/clothingItems';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons'; 
import ProductListItem from '@/src/components/ProductListItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SectionScreen = () => {
  const router = useRouter();
  const { section } = useLocalSearchParams();
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    // Filter items op basis van de sectie
    const filtered = items.filter(item => item.section === section);
    setFilteredItems(filtered);
  }, [section]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: section.toString(), 
          headerShown: true,
          headerTransparent: false,
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.header}>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.buttonText}>Sorteren op</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter" size={20} color={Colors.black} />
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
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
    marginLeft: 5,
    fontSize: 16,
    color: Colors.black,
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

export default SectionScreen;