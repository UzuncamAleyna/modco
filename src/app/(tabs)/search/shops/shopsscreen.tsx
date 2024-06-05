import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import SearchBar from '@/src/components/SearchBar';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import shopData from '../../../../../assets/data/shopsData';


const calculateAverageRating = (reviews) => {
  const total = reviews.reduce((sum, rating) => sum + rating.rating, 0);
  return total / reviews.length;
};

const Shops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShops, setFilteredShops] = useState(shopData);
  const router = useRouter();

  useEffect(() => {
    if (searchTerm) {
      setFilteredShops(
        shopData.filter(shop =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredShops(shopData);
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shops',
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
      <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
      <FlatList
        data={filteredShops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shopContainer}>
            <Image source={item.image} style={styles.shopImage} />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{item.name}</Text>
              <View style={styles.shopReviews}>
                {[...Array(Math.floor(calculateAverageRating(item.reviews)))].map((_, i) => (
                  <RatingStar key={i} name="star" size={20} color={Colors.blueIris} />
                ))}
                {[...Array(5 - Math.floor(calculateAverageRating(item.reviews)))].map((_, i) => (
                  <RatingStar key={i} name="star" size={20} color={Colors.lightGrey} />
                ))}
                <Text style={styles.shopReviewText}>
                  ({item.reviews.length})
                </Text>
              </View>
            </View>
            <Link href={`/search/shops/shopdetail/${item.id}`} asChild>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Bekijk</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  shopReviews: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopReviewText: {
    fontSize: 14,
    color: Colors.grey,
    marginLeft: 5,
  },
  viewButton: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 5,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
});

export default Shops;
