import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import clothingItems from '../../../../../assets/data/clothingItems';
import Colors from '@/src/constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome'; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Item = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const item = clothingItems.find(item => item.id.toString() === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

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

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / wp('100%'));
    setCurrentImageIndex(index);
  };

  const handleViewMoreReviews = () => {
    router.push(`/home/reviews/reviewsscreen?id=${id}`);
  };

  const limitWords = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView>
        <Stack.Screen 
          options={{ 
            title: 'Detail: ' + id, 
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{backgroundColor: 'rgba(255,255,255,0.7)', borderRadius:20, padding: 10, marginLeft:10, marginBottom: 10, width: 40, height: 40}}>
                <Icon name="chevron-left" size={24} color={Colors.black} style={{marginLeft:5}}/>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.imageContainer}>
          <FlatList
            data={item.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            keyExtractor={(image, index) => index.toString()} 
            renderItem={({ item }) => (
              <Image source={item} style={styles.image} />
            )}
          />
          <View style={styles.pageControl}>
            {item.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.pageDot,
                  currentImageIndex === index && styles.pageDotActive
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>€ {item.price}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(Math.round(averageRating))].map((_, i) => (
              <RatingStar key={i} name="star" size={20} color={Colors.blueIris} />
            ))}
            {[...Array(5 - Math.round(averageRating))].map((_, i) => (
              <RatingStar key={i} name="star" size={20} color={Colors.lightGrey} />
            ))}
            <Text style={styles.reviewText}>({reviewCount})</Text>
            <TouchableOpacity style={styles.heartButton}>
              <Icon name="heart" size={24} color={Colors.blueIris} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschrijving</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionContent}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productdetails</Text>
          <Text style={styles.sectionContent}>Maat: Verkrijgbaar in {Array.isArray(item.size) ? item.size.join(', ') : [item.size].join(', ')}</Text>
          <Text style={styles.sectionContent}>Materiaal: {item.material}</Text>
          <Text style={styles.sectionContent}>Kleur: {item.color}</Text>
          <Text style={styles.sectionContent}>Lengte: {item.length}</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sellerContainer}>
            <View style={styles.sellerInfo}>
              <Image source={item.seller.image} style={styles.sellerImage} />
              <Text style={styles.sellerName}>{item.seller.name}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Volgend</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beoordelingen</Text>
          {item.reviews.length > 0 && (
            <View style={styles.reviewContainer}>
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewAuthor}>{item.reviews[0].author}</Text>
                <Text style={styles.reviewDate}>{item.reviews[0].date}</Text>
              </View>
              <View style={styles.reviewStars}>
                {[...Array(item.reviews[0].rating)].map((_, i) => (
                  <RatingStar key={i} name="star" size={16} color={Colors.blueIris} />
                ))}
                {[...Array(5 - item.reviews[0].rating)].map((_, i) => (
                  <RatingStar key={i} name="star" size={16} color={Colors.lightGrey} />
                ))}
              </View>
              <Text style={styles.reviewContent}>{limitWords(item.reviews[0].content, 20)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMoreReviews}>
            <Text style={styles.viewMoreButtonText}>Bekijk meer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: wp('100%'),
    height: hp('60%'),
    resizeMode: 'cover',
  },
  pageControl: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  pageDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  itemPrice: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 10,
    fontFamily: 'Roboto-Bold',
  },
  reviewContainer: {
    flexDirection: 'column',
    marginTop: 10,
    borderWidth: 0.25,
    borderColor: Colors.grey,
    borderRadius: 5,
    padding: 10,
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 16,
    color: Colors.black,
  },
  heartButton: {
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
  },
  descriptionContainer: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  followButton: {
    marginLeft: 'auto',
    backgroundColor: Colors.blueIris,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    fontSize: 14,
    color: Colors.grey,
    fontFamily: 'Roboto-Regular',
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
  viewMoreButton: {
    marginTop: 20,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  viewMoreButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default Item;
