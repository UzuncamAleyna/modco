import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Octicons';
import RatingStar from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

const Item = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { session } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          shops (id, name, image),
          fashion_item_photos (url),
          reviews (
            rating,
            comment,
            user_id,
            created_at
          ),
          fashion_item_sizes (
            sizes (name)
          ),
          fashion_item_colors (
            colors (name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching item:', error.message);
      } else {
        setItem(data);
        console.log('Fetched Item:', JSON.stringify(data, null, 2));
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
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

    if (item) {
      const userIds = item.reviews.map(review => review.user_id);
      fetchProfiles(userIds);
    }
  }, [item]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / wp('100%'));
    setCurrentImageIndex(index);
  };

  const handleSizePress = (size: string) => {
    setSelectedSize(size);
  };

  // const handleBuyPress = async () => {
  //   if (!selectedSize) {
  //     Alert.alert('Error', 'Gelieve een maat te selecteren');
  //     return;
  //   }

  //   const response = await axios.post('http://172.20.10.2:3000/create-payment-intent', {
  //     amount: parseFloat(item.price) * 100,
  //     currency: 'eur',
  //   });

  //   const { clientSecret } = response.data;

  //   const { error } = await initPaymentSheet({
  //     paymentIntentClientSecret: clientSecret,
  //     merchantDisplayName: 'MODCO',
  //     returnURL: 'myapp://home',
  //   });

  //   if (!error) {
  //     const { error: presentError } = await presentPaymentSheet();
  //     if (presentError) {
  //       Alert.alert('Error', 'Er is iets misgegaan bij het betalen.');
  //     } else {
  //       Alert.alert('Success', 'Betaling geslaagd');

  //       await axios.post('http://192.168.129.6:3000/save-order', {
  //         userId: session ? session.user.id : null,
  //         fashionItemId: item.id,
  //         price: parseFloat(item.price),
  //         size: selectedSize,
  //         imageUrl: item.fashion_item_photos[0].url
  //       });

  //       router.push('/home');
  //     }
  //   } else {
  //     Alert.alert('Error', error.message);
  //   }
  // };

  const addToFavorites = async () => {
    if (!session) {
      alert('Je moet ingelogd zijn om favorieten toe te voegen.');
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([
        { user_id: session.user.id, item_id: item.id }
      ]);

    if (error) {
      console.error('Error adding to favorites:', error.message);
      alert('Er is iets misgegaan bij het toevoegen aan favorieten.');
    } else {
      alert('Item toegevoegd aan favorieten!');
    }
  };

  if (!item) {
    return (
      <View>
        <Stack.Screen options={{ title: 'Detail: ' + id, headerShown: false }} />
        <Text>Mode-artikel niet gevonden</Text>
      </View>
    );
  }

  const firstPhoto = item.fashion_item_photos.length ? item.fashion_item_photos[0].url : null;
  const shopName = item.shops ? item.shops.name : 'Unknown Shop';
  const shopId = item.shops ? item.shops.id : null;
  const shopImage = item.shops ? item.shops.image : null;
  const sizes = item.fashion_item_sizes.map(sizeItem => sizeItem.sizes.name).sort((a, b) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  }).join(' | ');
  const colors = item.fashion_item_colors.map(colorItem => colorItem.colors.name).join(', ');

  const handleViewShop = () => {
    if (shopId) {
      router.push(`/search/shops/shopdetail/${shopId}`);
    }
  };

  const averageRating = item.reviews.length > 0
    ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length
    : 0;

  const reviewCount = item.reviews.length;

  const handleViewMoreReviews = () => {
    router.push(`/home/reviews/${id}`);
  };

  const review = item.reviews[0];

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
              <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 10, marginLeft: 10, marginBottom: 10, width: 40, height: 40 }}>
                <Icon name="chevron-left" size={24} color={Colors.black} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.imageContainer}>
          <FlatList
            data={item.fashion_item_photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            keyExtractor={(photo) => photo.url}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={styles.image} />
            )}
          />
          <View style={styles.pageControl}>
            {item.fashion_item_photos.map((_, index) => (
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
          <Text style={styles.itemName}>{item.title}</Text>
          <Text style={styles.itemPrice}>€ {item.price}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(Math.round(averageRating))].map((_, i) => (
              <RatingStar key={i} name="star" size={20} color={Colors.blueIris} />
            ))}
            {[...Array(5 - Math.round(averageRating))].map((_, i) => (
              <RatingStar key={i} name="star" size={20} color={Colors.lightGrey} />
            ))}
            <Text style={styles.reviewText}>({reviewCount})</Text>
            <TouchableOpacity style={styles.heartButton} onPress={addToFavorites}>
              <Icon name="heart" size={24} color={Colors.blueIris} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity onPress={handleBuyPress} style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Koop</Text>
        </TouchableOpacity> */}
        {/* <View style={styles.separator}></View>         */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beschrijving</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionContent}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productdetails</Text>
          <Text style={styles.sectionContent}>Kleur: {colors}</Text>
          <Text style={styles.sectionContent}>Maat: Verkrijgbaar in {sizes}</Text>
          {/* <View style={styles.sizesContainer}>
            {sizes.length > 0 ? (
              sizes.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSizePress(size)}
                  style={[
                    styles.sizeButton,
                    {
                      borderColor: size === selectedSize ? Colors.blueIris : Colors.black,
                      borderWidth: size === selectedSize ? 2 : 0.25,
                    }
                  ]}
                >
                  <Text style={styles.sizeText}>{size}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSizesText}>Geen maten beschikbaar</Text>
            )}
          </View> */}
        </View>
        <View style={styles.section}>
          <View style={styles.sellerContainer}>
            <View style={styles.sellerInfo}>
              <Image source={{ uri: shopImage }} style={styles.sellerImage} />
              <Text style={styles.sellerName}>{shopName}</Text>
            </View>
            <TouchableOpacity style={styles.followButton} onPress={handleViewShop}>
              <Text style={styles.followButtonText}>Bekijk</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beoordelingen</Text>
          {review && (
            <View style={styles.reviewContainer}>
              <View style={styles.reviewerInfo}>
                <Text style={styles.reviewAuthor}>{profiles[review.user_id]}</Text>
                <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
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
          )}
          {reviewCount > 1 && (
            <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewMoreReviews}>
              <Text style={styles.viewMoreButtonText}>Bekijk meer</Text>
            </TouchableOpacity>
          )}
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
  separator: {
    height: 1,
    backgroundColor: Colors.lightGrey,
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
  sizesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  sizeButton: {
    borderWidth: 0.25,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    width: 40,
    alignItems: 'center',
  },
  sizeText: {
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
  },
  noSizesText: {
    fontSize: 12,
    color: Colors.grey,
    fontFamily: 'Roboto-Regular',
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
  buyButton: {
    backgroundColor: Colors.black,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  buyButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Item;
