import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/src/lib/supabase';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useAuth } from '@/src/providers/AuthProvider';

const ShopDetail = () => {
  const { id } = useLocalSearchParams();
  const [shop, setShop] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();
  const { session } = useAuth();


  useEffect(() => {
    const fetchShopDetails = async () => {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          id,
          name,
          email,
          description,
          image,
          collections (
            id,
            name,
            fashion_items (
              id,
              title,
              fashion_item_photos (url),
              reviews (
                rating
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching shop details:', error);
      } else {
        setShop(data);
        fetchFollowersCount(data.id);
        setIsFollowing(data.id);
        if (session) checkIfFollowing(data.id);
      }
    };
    fetchShopDetails();
  }, [id, session]);

  const fetchFollowersCount = async (shopId) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact' })
      .eq('shop_id', shopId);

    if (error) {
      console.error('Error fetching followers count:', error);
    } else {
      setFollowersCount(count);
    }
  };

  const checkIfFollowing = async (shopId) => {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('shop_id', shopId)
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking follow status:', error);
    } else {
      setIsFollowing(!!data);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      Alert.alert(
        'Niet ingelogd',
        'Je moet inloggen om deze shop te kunnen volgen.',
        [
          {
            text: 'Annuleer',
            style: 'cancel',
          },
          {
            text: 'Inloggen',
            onPress: () => router.push('/login'),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    if (isFollowing) {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('shop_id', shop.id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error unfollowing shop:', error);
      } else {
        setIsFollowing(false);
        setFollowersCount(followersCount - 1);
      }
    } else {
      const { error } = await supabase
        .from('followers')
        .insert({ shop_id: shop.id, user_id: session.user.id });

      if (error) {
        console.error('Error following shop:', error);
      } else {
        setIsFollowing(true);
        setFollowersCount(followersCount + 1);
      }
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  if (!shop) {
    return (
      <View style={styles.container}>
        <Text>Shop niet gevonden</Text>
      </View>
    );
  }

  const allReviews = shop.collections.flatMap(collection => collection.fashion_items.flatMap(item => item.reviews));
  const averageRating = calculateAverageRating(allReviews);
  const reviewCount = allReviews.length;

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
        <Image source={{ uri: shop.image }} style={styles.shopImage} />
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.followButtonText}>{isFollowing ? 'Ontvolgen' : 'Volgen'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.shopInfoContainer}>
        <Link href={`/search/shops/reviews/${id}`} asChild>
          <Pressable style={styles.ratingContainer}>
            {reviewCount > 0 ? (
              <>
                {[...Array(Math.floor(averageRating))].map((_, i) => (
                  <RatingStar key={i} name="star" size={20} color={Colors.blueIris} />
                ))}
                {[...Array(5 - Math.floor(averageRating))].map((_, i) => (
                  <RatingStar key={i} name="star" size={20} color={Colors.lightGrey} />
                ))}
                <Text style={styles.shopReviews}>
                  {averageRating} ({reviewCount})
                </Text>
              </>
            ) : (
              <Text style={styles.shopReviews}>Geen beoordelingen</Text>
            )}
          </Pressable>
        </Link>
        <Text style={styles.shopFollowers}>{followersCount} volgers</Text>
      </View>
      <View style={styles.shopDescriptionContainer}>
        <Text style={styles.sectionTitle}>Over {shop.name}</Text>
        <Text style={styles.shopDescription}>{shop.description}</Text>
      </View>
      <View style={styles.shopCollectionsContainer}>
        <Text style={styles.sectionTitle}>Collecties</Text>
        <View style={styles.collectionsRow}>
          {shop.collections.slice(0, 2).map(collection => (
            <View key={collection.id} style={styles.collectionContainer}>
              <Text style={styles.collectionName}>{collection.name}</Text>
              {collection.fashion_items[0] && collection.fashion_items[0].fashion_item_photos[0] && (
                <Image
                  source={{ uri: collection.fashion_items[0].fashion_item_photos[0].url }}
                  style={styles.collectionImage}
                />
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push(`/search/shops/collections/collectionsscreen?shopId=${id}`)}>
          <Text style={styles.viewMoreButtonText}>Ontdek meer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactContainer}>
        <Text style={styles.sectionTitle}>Vraag?</Text>
        <Text style={styles.contactDescription}>Heb je een vraag of wil je meer weten? Neem gerust contact op met {shop.name} via e-mail. We helpen je graag verder!</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            // Open email client
            router.push(`mailto:${shop.email}`);
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
  },
  collectionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collectionContainer: {
    width: '48%',
  },
  collectionImage: {
    width: '100%',
    height: wp('40%'),
    marginBottom: wp('0.5%'),
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
