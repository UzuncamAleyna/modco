import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Octicons';
import Colors from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';


const CreateShopScreen = () => {
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, setProfile, setIsDesigner } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const blob = await (await fetch(uri)).blob();
    const imageName = `${session.user.id}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('shop_images')
      .upload(imageName, decode(base64), { contentType: 'image' });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('shop_images')
      .getPublicUrl(imageName);
      
    return publicUrlData.publicUrl;
  };

  const handleCreateShop = async () => {
    if (!shopName || !shopEmail || !shopDescription || !creditCardNumber) {
      Alert.alert('Alle velden zijn verplicht');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { data, error } = await supabase.from('shops').insert([
        {
          name: shopName,
          email: shopEmail,
          description: shopDescription,
          credit_card_number: creditCardNumber,
          user_id: session.user.id,
          image: imageUrl,
        },
      ]);

      if (error) {
        throw error;
      }

      // Update user group to DESIGNER
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ group: 'DESIGNER' })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }

      // Update profile state
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setProfile(updatedProfile);
      setIsDesigner(updatedProfile.group === 'DESIGNER');
      
      Alert.alert('Winkel succesvol aangemaakt!', '', [
        { text: 'OK', onPress: () => router.replace('/sell/sellscreen') }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error creating shop:', error.message);
      Alert.alert('Er is iets misgegaan. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen 
        options={{ 
          title: 'Winkel starten', 
          headerShown: true,
          headerTransparent: false,
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
      <Text style={styles.label}>Winkelnaam *</Text>
      <TextInput
        style={styles.input}
        value={shopName}
        onChangeText={setShopName}
      />
      <Text style={styles.label}>Email van de winkel *</Text>
      <TextInput
        style={styles.input}
        value={shopEmail}
        onChangeText={setShopEmail}
      />
      <Text style={styles.label}>Beschrijving *</Text>
      <TextInput
        style={styles.input}
        value={shopDescription}
        onChangeText={setShopDescription}
      />
      <Text style={styles.label}>Creditcardnummer *</Text>
      <TextInput
        style={styles.input}
        value={creditCardNumber}
        onChangeText={setCreditCardNumber}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Upload Winkelafbeelding *</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.button} onPress={handleCreateShop} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Eventjes geduld...' : 'Winkel starten'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,  
  },
  contentContainer: {
    alignItems: 'center',
    padding: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'flex-start',
  },
  input: {
    width: wp('80%'),
    height: hp('5%'),
    marginBottom: 20,
    paddingLeft: 10,
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  backButton: {
    marginLeft: 10,
  },
  imagePicker: {
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: Colors.black,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  imagePreview: {
    width: wp('80%'),
    height: hp('20%'),
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default CreateShopScreen;
