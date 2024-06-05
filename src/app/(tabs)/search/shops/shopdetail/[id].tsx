import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Pressable } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import shopData from '../../../../../../assets/data/shopsData';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ShopDetail = () => {
  const { id } = useLocalSearchParams();
  const shop = shopData.find(shop => shop.id.toString() === id);

  if (!shop) {
    console.log('Shop not found for ID:', id);
    return (
      <View>
        <Text>Shop niet gevonden</Text>
      </View>
    );
  } else {
    console.log('Shop found:', id);
  }

  const calculateAverageRating = (reviews) => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: shop.name,
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
      <View style={styles.shopImageContainer}>
        <Image source={shop.image} style={styles.shopImage} />
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Volgen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.shopInfoContainer}>
        <Link href={`/search/shops/reviews/${id}`} asChild>
        <Pressable style={styles.ratingContainer}>
          {[...Array(Math.floor(parseInt(calculateAverageRating(shop.reviews))))].map((_, i) => (
            <RatingStar key={i} name="star" size={20} color={Colors.blueIris} />
          ))}
          {[...Array(5 - Math.floor(parseInt(calculateAverageRating(shop.reviews))))].map((_, i) => (
            <RatingStar key={i} name="star" size={20} color={Colors.lightGrey} />
          ))}
          <Text style={styles.shopReviews}>
            {calculateAverageRating(shop.reviews)} ({shop.reviews.length})
          </Text>
        </Pressable>
        </Link>
        <Text style={styles.shopFollowers}>{shop.followers} volgers</Text>
      </View>
      <View style={styles.shopDescriptionContainer}>
        <Text style={styles.sectionTitle}>Over {shop.name}</Text>
        <Text style={styles.shopDescription}>{shop.description}</Text>
      </View>
      <View style={styles.shopCollectionsContainer}>
        <Text style={styles.sectionTitle}>Collecties</Text>
        <FlatList
          data={shop.collections}
          keyExtractor={(item) => item.name}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.collectionContainer}>
              <View>
              <FlatList
                data={item.items.slice(0, 4)} // Show first 4 items only
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Image source={item.image} style={styles.collectionImage} />
                )}
              />
              <Text style={styles.collectionName}>{item.name}</Text>
              </View>
              <View>
              <FlatList
                data={item.items.slice(0, 4)} // Show first 4 items only
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Image source={item.image} style={styles.collectionImage} />
                )}
              />
              <Text style={styles.collectionName}>{item.name}</Text>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push(`/search/shops/${id}/collections/collectionsscreen`)}>
          <Text style={styles.viewMoreButtonText}>Ontdek meer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Vraag?</Text>
        <Text style={styles.contactDescription}>Heb je een vraag of wil je meer weten? Neem gerust contact op met {shop.name} via e-mail. We helpen je graag verder!</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            // Open email client with pre-filled email address
            router.push(`mailto:${shop.contactEmail}`);
          }}
        >
          <Text style={styles.contactButtonText}>Contacteer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  shopImageContainer: {
    position: 'relative',
  },
  shopImage: {
    width: wp('100%'),
    height: hp('50%'),
    resizeMode: 'cover',
  },
  followButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.blueIris,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  followButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  shopInfoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopReviews: {
    fontSize: 14,
    color: Colors.blueIris,
    marginLeft: 5,
    fontFamily: 'Roboto-Bold',
  },
  shopFollowers: {
    fontSize: 14,
    color: Colors.blueIris,
    fontFamily: 'Roboto-Bold',
  },
  shopDescriptionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  shopDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    lineHeight: 20,
  },
  shopCollectionsContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    justifyContent: 'space-between',
  },
  collectionContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  collectionImage: {
    width: wp('20%'),
    height: wp('20%'),
    margin: wp('0.5%'),
    borderRadius: 5,
  },
  collectionName: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    marginTop: 10,
    textAlign: 'center',
  },
  viewMoreButton: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.black,
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  contactContainer: {
    padding: 20,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    marginBottom: 10,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: Colors.black,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default ShopDetail;
