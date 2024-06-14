import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams, Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/src/lib/supabase';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ShopReviews = () => {
  const { id } = useLocalSearchParams();
  const [reviews, setReviews] = useState([]);
  const [profiles, setProfiles] = useState({});

  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          shop_id,
          fashion_item_id,
          rating,
          fit,
          comment,
          created_at,
          fashion_items (
            title,
            fashion_item_photos (url)
          )
        `)
        .eq('shop_id', id);
  
      if (reviewsError) throw reviewsError;
  
      // Fetch profiles
      const userIds = reviews.map(review => review.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);
  
      if (profilesError) throw profilesError;
  
      // Map profiles to reviews
      const reviewsWithProfiles = reviews.map(review => {
        const profile = profiles.find(profile => profile.id === review.user_id);
        return {
          ...review,
          full_name: profile ? profile.full_name : 'Unknown'
        };
      });
  
      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error('Error fetching reviews or profiles:', error.message);
    }
  };

  const fetchProfiles = async (userIds) => {
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (error) throw error;

      const profilesMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile.full_name;
        return acc;
      }, {});

      setProfiles(profilesMap);
    } catch (error) {
      console.error('Error fetching profiles:', error.message);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewerInfo}>
        {item.fashion_items.fashion_item_photos.length > 0 && (
          <Image
            source={{ uri: item.fashion_items.fashion_item_photos[0].url }}
            style={styles.reviewImage}
          />
        )}
        <View style={styles.itemReview}>
          <View style={styles.reviewerNameDate}>
            <Text style={styles.reviewAuthor}>{item.full_name}</Text>
            <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
          <View style={styles.reviewStars}>
            {[...Array(item.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.blueIris} />
            ))}
            {[...Array(5 - item.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.lightGrey} />
            ))}
          </View>
          <Text style={styles.itemInfo}>{item.fashion_items.title}</Text>
          <Text style={styles.itemInfo}>{item.fit}</Text>
        </View>
      </View>
      <Text style={styles.reviewContent}>{item.comment}</Text>
    </View>
  );

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
      {/* <View style={styles.filterSortContainer}>
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
      </View> */}
      <Text style={styles.itemCount}>{reviews.length} beoordelingen gevonden</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
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
    height: hp('14%'),
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
