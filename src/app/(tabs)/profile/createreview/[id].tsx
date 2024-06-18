import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView,  ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import StarRating from 'react-native-star-rating-widget';

const CreateReview = () => {
  const { session } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [fit, setFit] = useState('');
  const [review, setReview] = useState('');
  const [reviewDetails, setReviewDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReviewDetails();
    }
  }, [id]);

  const fetchReviewDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          fashion_items (id, title, shop_id, fashion_item_photos (url))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Fetched data:', data);
        setReviewDetails(data);
      } else {
        console.log('No data found for order ID:', id);
      }
    } catch (error) {
      console.error('Error fetching review details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || fit === '' || review === '') {
      Alert.alert('Error', 'Alle velden zijn verplicht.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: session.user.id,
            fashion_item_id: reviewDetails.fashion_items.id,
            shop_id: reviewDetails.fashion_items.shop_id,
            rating: Math.round(rating), 
            fit,
            comment: review,
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'Beoordeling succesvol geplaatst.');
      router.push('/profile/profilescreen');
    } catch (error) {
      console.error('Error saving review:', error.message);
      Alert.alert('Error', 'Er is iets misgegaan bij het opslaan van je beoordeling.');
    }
  };

  if (loading) {
    return <Text>Aan het laden...</Text>;
  }

  if (!reviewDetails) {
    return <Text>Geen bestelling gevonden.</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >      
    <ScrollView contentContainerStyle={styles.scrollView}>

    <Stack.Screen
        options={{
          title: 'Beoordelen',
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
      <Text style={styles.title}>{reviewDetails.fashion_items.title}</Text>
      {reviewDetails.fashion_items.fashion_item_photos.length > 0 && (
        <Image source={{ uri: reviewDetails.fashion_items.fashion_item_photos[0].url }} style={styles.image} />
      )}
      <Text style={styles.label}>Sterrenscore:</Text>
      <StarRating
        rating={rating}
        onChange={setRating}
        starSize={30}
        color={Colors.blueIris}
      />
      <Text style={styles.label}>Algemene pasvorm:</Text>
      <View style={styles.fitContainer}>
          <TouchableOpacity onPress={() => setFit('Klein')} style={[styles.fitOption, fit === 'Klein' && styles.selectedFitOption]}>
            <Text style={[styles.fitText, fit === 'Klein' && styles.selectedFitText]}>Klein</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFit('Op maat')} style={[styles.fitOption, fit === 'Op maat' && styles.selectedFitOption]}>
            <Text style={[styles.fitText, fit === 'Op maat' && styles.selectedFitText]}>Op maat</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFit('Groot')} style={[styles.fitOption, fit === 'Groot' && styles.selectedFitOption]}>
            <Text style={[styles.fitText, fit === 'Groot' && styles.selectedFitText]}>Groot</Text>
          </TouchableOpacity>
        </View>

      <Text style={styles.label}>Geef jouw beoordeling over het artikel:</Text>
      <TextInput
        style={styles.textInput}
        value={review}
        onChangeText={setReview}
        multiline
        numberOfLines={4}
        placeholder="Schrijf hier je beoordeling..."
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Beoordeling plaatsen</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
    flex: 1,
  },
  scrollView: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PPMonumentExtended-Regular',
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  fitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fitOption: {
    flex: 1,
    alignItems: 'center',
  },
  fitText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 5,
  },
  textInput: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  selectedFitOption: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.blueIris,
  },
  selectedFitText: {
    color: Colors.blueIris,
  },
  submitButton: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CreateReview;
