import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Text, View } from 'react-native';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Link } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

const ProductListItem = ({ item }) => {
  const { session } = useAuth();
  const firstPhoto = item.fashion_item_photos.length ? item.fashion_item_photos[0].url : null;
  const shopName = item.shops ? item.shops.name : 'Unknown Shop';

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

  return (
    <Link href={`/home/item/${item.id}`} asChild>
      <Pressable style={styles.itemContainer}>
        {firstPhoto && <Image source={{ uri: firstPhoto }} style={styles.image} />}
        <TouchableOpacity style={styles.heartButton} onPress={addToFavorites}>
          <Icon name="heart" size={24} color={Colors.blueIris} />
        </TouchableOpacity>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.brand}>{shopName}</Text>
        <Text style={styles.price}>€ {item.price}</Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: wp('50%'),
    height: hp('30%'),
    borderRadius: 5,
    paddingRight: 10,
    position: 'relative',
    marginBottom: 50,
  },
  heartButton: {
    position: 'absolute',
    bottom: hp('6%'),
    right: wp('12%'),
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    opacity: 0.8,
  },
  title: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Roboto-Light',
  },
  image: {
    width: wp('40%'),
    height: hp('25%'),
    borderRadius: 5,
    marginBottom: 10,
  },
  brand: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
  },
  price: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Roboto-Bold',
  },
});

export default ProductListItem;
