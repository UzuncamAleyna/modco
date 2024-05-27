import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, Link } from 'expo-router';
import clothingItems from '../../../../../assets/data/clothingItems';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';

const Reviews = () => {
  const { id } = useLocalSearchParams();
  const item = clothingItems.find(item => item.id.toString() === id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (item && item.reviews.length > 0) {
      const totalRating = item.reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = totalRating / item.reviews.length;
      setAverageRating(average);
      setReviewCount(item.reviews.length);
    }
  }, [item]);

  if (!item) {
    return (
      <View>
        <Stack.Screen options={{ title: 'Detail: ' + id, headerShown: false }} />
        <Text>Mode-artikel niet gevonden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Beoordelingen', 
          headerShown: true,
          headerTransparent: false,
          headerTitle: 'Beoordelingen',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{backgroundColor: 'rgba(255,255,255,0.7)', borderRadius:20, padding: 10, marginLeft:10, marginBottom: 10, width: 40, height: 40}}>
              <Icon name="chevron-left" size={24} color={Colors.black} style={{marginLeft:5}}/>
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
      <Text style={styles.reviewCount}>{item.reviews.length} beoordelingen</Text>
      {item.reviews.map((review, index) => (
        <View key={index} style={styles.reviewContainer}>
          <View style={styles.reviewerInfo}>
            <Text style={styles.reviewAuthor}>{review.author}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
          <Text style={styles.reviewFitting}>{review.fitting}</Text>
          <View style={styles.reviewStars}>
            {[...Array(review.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.blueIris} />
            ))}
            {[...Array(5 - review.rating)].map((_, i) => (
              <RatingStar key={i} name="star" size={16} color={Colors.lightGrey} />
            ))}
          </View>
          <Text style={styles.reviewContent}>{review.content}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginLeft: 10,
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
    justifyContent: 'space-between',
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
    reviewFitting: {
        fontSize: 16,
        color: Colors.black,
        marginTop: 5,
        fontFamily: 'Roboto-Bold',
    },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 5,
  },
  reviewContent: {
    fontSize: 16,
    color: Colors.black,
    marginTop: 5,
    fontFamily: 'Roboto-Regular',
  },
});

export default Reviews;
