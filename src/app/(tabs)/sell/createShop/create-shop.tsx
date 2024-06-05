import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';
import Colors from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useAuth } from '@/src/providers/AuthProvider';

const CreateShopScreen = () => {
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useAuth();

  const handleCreateShop = async () => {
    if (!shopName || !shopEmail || !shopDescription || !creditCardNumber) {
      Alert.alert('Alle velden zijn verplicht');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.from('shops').insert([
      {
        name: shopName,
        email: shopEmail,
        description: shopDescription,
        credit_card_number: creditCardNumber,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.error('Error creating shop:', error.message);
      Alert.alert('Er is iets misgegaan. Probeer het opnieuw.');
      setLoading(false);
    } else {
      // Update user group to DESIGNER
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ group: 'DESIGNER' })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError.message);
        Alert.alert('Er is iets misgegaan. Probeer het opnieuw.');
        setLoading(false);
      } else {
        Alert.alert('Winkel succesvol aangemaakt!', '', [
          { text: 'OK', onPress: () => router.push('/sell/sellscreen') }
      ]);
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleCreateShop} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Eventjes geduld...' : 'Winkel starten'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.white,  
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
});

export default CreateShopScreen;
