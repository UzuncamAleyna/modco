import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/src/lib/supabase';

const Reviews = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          fit,
          user_id,
          created_at,
          fashion_items (title, fashion_item_photos (url))
        `)
        .eq('fashion_item_id', id);

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError.message);
        setLoading(false);
        return;
      }

      const userIds = reviewsData.map(review => review.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        setLoading(false);
        return;
      }

      const profilesMap = profilesData.reduce((acc, profile) => {
        acc[profile.id] = profile.full_name;
        return acc;
      }, {});

      setReviews(reviewsData);
      setProfiles(profilesMap);
      setLoading(false);
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <Text>Aan het laden...</Text>;
  }

  if (reviews.length === 0) {
    return <Text>Geen beoordelingen gevonden</Text>;
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
      {/* <View style={styles.filterSortContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sorteren op</Text>
          <Icon name="chevron-down" size={16} color={Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Filter</Text>
          <Icon name="filter" size={16} color={Colors.black} />
        </TouchableOpacity>
      </View> */}
      <Text style={styles.reviewCount}>{reviews.length} beoordelingen</Text>
      {reviews.map((review, index) => (
        <View key={index} style={styles.reviewContainer}>
          <View style={styles.reviewerInfo}>
            <Image source={{ uri: review.fashion_items.fashion_item_photos[0].url }} style={styles.reviewImage} />
            <View>
              <Text style={styles.reviewAuthor}>{profiles[review.user_id]}</Text>
              <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
              <Text style={styles.reviewDate}>{review.fit}</Text>
            </View>
          </View>
          <View style={styles.reviewStars}>
            {[...Array(review.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.blueIris} />
            ))}
            {[...Array(5 - review.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.lightGrey} />
            ))}
          </View>
          <Text style={styles.reviewContent}>{review.comment}</Text>
        </View>
      ))}
    </ScrollView>
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
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginRight: 5,
  },
  reviewCount: {
    padding: 15,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  reviewContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  reviewerInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  reviewAuthor: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: Colors.grey,
  },
  reviewDate: {
    fontSize: 14,
    color: Colors.grey,
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 5,
  },
  reviewContent: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 5,
  },
});

export default Reviews;
