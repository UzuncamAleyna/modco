import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import shopData from '../../../../../../assets/data/shopsData';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ShopReviews = () => {
  const { id } = useLocalSearchParams();
  const shop = shopData.find(shop => shop.id.toString() === id);
  const router = useRouter();
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (shop) {
      setFilteredItems(shop.reviews);
    }
  }, [shop]);

  if (!shop) {
    console.log('Reviews not found for ID:', id);
    return (
      <View>
        <Text>Beoordelingen niet gevonden</Text>
      </View>
    );
  } else {
    console.log('Reviews found:', id);
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Beoordelingen',
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
      <Link href="/home/sort/sort" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sorteren op</Text>
          <Icon name="chevron-down" size={16} color={Colors.black} />
        </TouchableOpacity>
      </Link>
      <Link href="/home/filter/filter" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Filter</Text>
          <Icon name="filter" size={16} color={Colors.black} />
        </TouchableOpacity>
      </Link>
      </View>
      <Text style={styles.itemCount}>{filteredItems.length} artikelen gevonden</Text>
      <FlatList
        data={shop.reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewContainer}>
            <View style={styles.reviewerInfo}>
              <Image source={item.itemImage} style={styles.reviewImage} />
              <View style={styles.itemReview}>
                <View style={styles.reviewerNameDate}>
                  <Text style={styles.reviewAuthor}>{item.author}</Text>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[...Array(item.rating)].map((_, i) => (
                    <RatingStar key={i} name="star" size={16} color={Colors.blueIris} />
                  ))}
                  {[...Array(5 - item.rating)].map((_, i) => (
                    <RatingStar key={i} name="star" size={16} color={Colors.lightGrey} />
                  ))}
                </View>
                <Text style={styles.itemInfo}>{item.name}</Text>
                <Text style={styles.itemInfo}>{item.fitting}</Text>
              </View>
            </View>
            <Text style={styles.reviewContent}>{item.content}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  reviewContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  itemReview: {
    width: wp('70%'),
    paddingRight: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewImage: {
    width: wp('20%'),
    height: hp('13%'),
    borderRadius: 5,
    marginRight: 10,
    resizeMode: 'cover',
  },
  reviewerNameDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reviewAuthor: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.grey,
  },
  reviewDate: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: 'Roboto-Regular',
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 10,
  },
  itemInfo: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    marginTop: 15,
  },
  reviewContent: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 15,
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
});

export default ShopReviews;
