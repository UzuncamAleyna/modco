import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';

const MyShopScreen = () => {
  const { session, refreshAuthStatus } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [shopImage, setShopImage] = useState('');
  const [collections, setCollections] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (session) {
        fetchShopDetails();
      }
    }, [session])
  );

  const fetchShopDetails = async () => {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        *,
        collections (
          id,
          name,
          fashion_items (
            id,
            fashion_item_photos (url)
          )
        )
      `)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching shop details:', error);
    } else {
      setShop(data);
      setShopName(data.name);
      setEmail(data.email);
      setDescription(data.description);
      setCreditCardNumber(data.credit_card_number);
      setShopImage(data.image);
      setCollections(data.collections);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imageName = `${session.user.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('shop_images')
        .upload(imageName, decode(base64), { contentType: 'image' });

      if (error) {
        console.error('Error uploading shop image:', error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('shop_images')
          .getPublicUrl(imageName);
        setShopImage(publicUrlData.publicUrl);
      }
    }
  };

  const handleSave = async () => {
    const updates = {
      name: shopName,
      email,
      description,
      credit_card_number: creditCardNumber,
      image: shopImage,
    };

    const { error } = await supabase
      .from('shops')
      .update(updates)
      .eq('id', shop.id);

    if (error) {
      console.error('Error updating shop:', error.message);
      Alert.alert('Er is iets misgegaan', 'Kon winkel niet bijwerken. Probeer het opnieuw.');
    } else {
      Alert.alert('Winkel bijgewerkt', 'Je winkel is succesvol bijgewerkt.');
    }
  };

  const handleDeleteShop = async () => {
    const { error: deleteError } = await supabase
      .from('shops')
      .delete()
      .eq('id', shop.id);

    if (deleteError) {
      console.error('Error deleting shop:', deleteError.message);
      Alert.alert('Er is iets misgegaan', 'Kon winkel niet verwijderen. Probeer het opnieuw.');
    } else {
      // Update user group to 'USER'
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ group: 'USER' })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Error updating user group:', updateError.message);
        Alert.alert('Er is iets misgegaan', 'Kon gebruikersgroep niet bijwerken. Probeer het opnieuw.');
      } else {
        Alert.alert('Winkel verwijderd', 'Je winkel is succesvol verwijderd.');
        refreshAuthStatus(); // Refresh the auth status to update the user group
        router.push('/profile/profilescreen'); // Navigate back to the profile screen
      }
    }
  };

  const handleAddCollection = () => {
    router.push('/sell/sellscreen');
  };

  const handleEditCollection = (collectionId) => {
    router.push(`/profile/editcollection/${collectionId}`);
  };

  const handleDeleteCollection = (collectionId) => {
    Alert.alert(
      'Collectie verwijderen',
      'Bent u zeker dat u deze collectie wilt verwijderen?',
      [
        {
          text: 'Annuleren',
          style: 'cancel',
        },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('collections')
              .delete()
              .eq('id', collectionId);

            if (error) {
              console.error('Error deleting collection:', error.message);
              Alert.alert('Er is iets misgegaan', 'Kon collectie niet verwijderen. Probeer het opnieuw.');
            } else {
              Alert.alert('Collectie verwijderd', 'Je collectie is succesvol verwijderd.');
              fetchShopDetails();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEditCollection(item.id)} style={styles.collectionItem}>
      <FlatList
        data={item.fashion_items}
        keyExtractor={(fashionItem) => fashionItem.id}
        renderItem={({ item: fashionItem }) => (
          <Image source={{ uri: fashionItem.fashion_item_photos[0]?.url }} style={styles.collectionImage} />
        )}
        numColumns={2}
      />
      <Text style={styles.collectionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Shop Wijzigen',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.shopImageContainer}>
        {shopImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: shopImage }} style={styles.shopImage} />
          </View>
        ) : (
          <Text>Geen foto</Text>
        )}
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Ionicons name="add-circle" size={24} color="gray" />
          <Text style={styles.photoButtonText}>Foto wijzigen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Merknaam</Text>
      <TextInput
        style={[styles.input, { color: Colors.blueIris }]}
        value={shopName}
        onChangeText={setShopName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { color: Colors.blueIris }]}
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Beschrijving</Text>
      <TextInput
        style={[styles.input, { color: Colors.blueIris }]}
        value={description}
        onChangeText={setDescription}
        multiline 
        numberOfLines={4}
      />
      <Text style={styles.label}>Creditcardnummer</Text>
      <TextInput
        style={[styles.input, { color: Colors.blueIris }]}
        value={creditCardNumber}
        onChangeText={setCreditCardNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteShop}>
        <Text style={styles.deleteButtonText}>Shop verwijderen</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Collecties</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCollection}>
        <Text style={styles.addButtonText}>Nieuwe collectie plaatsen</Text>
      </TouchableOpacity>
      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        renderItem={renderCollectionItem}
        horizontal
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  backButton: {
    marginLeft: 10,
  },
  shopImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  shopImage: {
    width: wp('50%'),
    height: wp('50%'),
    borderRadius: 10,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  photoButtonText: {
    marginLeft: 5,
    color: Colors.grey,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'flex-start',
  },
  input: {
    width: wp('90%'),
    height: hp('5%'),
    marginBottom: 20,
    paddingLeft: 10,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  button: {
    width: wp('90%'),
    height: 40,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  deleteButton: {
    width: wp('90%'),
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  deleteButtonText: {
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  addButton: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  collectionItem: {
    marginRight: 10,
  },
  collectionImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 10,
    marginBottom: 5,
  },
  collectionName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  collectionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  collectionButton: {
    backgroundColor: Colors.black,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  collectionButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
});

export default MyShopScreen;
