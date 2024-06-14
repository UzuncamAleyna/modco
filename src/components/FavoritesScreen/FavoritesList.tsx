import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Colors from '@/src/constants/Colors';
import FavoritesListItem from './FavoritesListItem'; 
import { supabase } from '@/src/lib/supabase';  
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';

const FavoritesList = ({ favorites, refreshFavorites }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleRemovePress = async (id) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing favorite:', error.message);
      alert('Er is iets misgegaan bij het verwijderen van de favoriet.');
    } else {
      refreshFavorites(); // Refresh the favorites list
      alert('Favoriet verwijderd.');
    }
  };

  const handleBuyPress = async (clientSecret, itemId) => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'MODCO',
      returnURL: 'myapp://home',
    });

    if (!error) {
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert('Error', 'Er is iets misgegaan bij het betalen.');
      } else {
        Alert.alert('Success', 'Betaling geslaagd');
        handleRemovePress(itemId);
      }
    } else {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <FlatList style={styles.container}
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const firstPhoto = item.fashion_items.fashion_item_photos.length 
          ? item.fashion_items.fashion_item_photos[0].url 
          : null;

        return (
          <FavoritesListItem
            fashionItemId={item.fashion_items.id} 
            name={item.fashion_items.title}
            sizes={item.fashion_items.sizes || []}
            price={item.fashion_items.price}
            imageUrl={{ uri: firstPhoto }} 
            onBuyPress={async (selectedSize) => {
             
              const response = await axios.post('http://192.168.129.6:3000/create-payment-intent', {
                amount: item.fashion_items.price, 
              });

              if (response.data.clientSecret) {
                handleBuyPress(response.data.clientSecret, item.id);
              } else {
                Alert.alert('Error', 'Er is iets misgegaan bij het verkrijgen van de betalingsinformatie.');
              }
            }}
            onClosePress={() => handleRemovePress(item.id)}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default FavoritesList;
