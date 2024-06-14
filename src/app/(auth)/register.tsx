import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons'; 
import Colors from '@/src/constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { supabase } from '../../lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

// Error messages from Supabase translated to Dutch
const errorMessages = {
    'Password should be at least 6 characters.': 'Wachtwoord moet minimaal 6 tekens bevatten.',
    'Unable to validate email address: invalid format': 'Kan e-mailadres niet valideren: ongeldig formaat',
    'User already registered': 'Deze email is al in gebruik',
};

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ username: '', fullName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession } = useAuth();

  const handleRegister = async () => {
    if (username === '' || fullName === '' || email === '' || password === '' || confirmPassword === '') {
      setError({
        username: username === '' ? 'Gelieve uw gebruikersnaam in te vullen' : '',
        fullName: fullName === '' ? 'Gelieve uw voornaam en naam in te vullen' : '',
        email: email === '' ? 'Gelieve uw e-mail in te vullen' : '',
        password: password === '' ? 'Gelieve uw wachtwoord in te vullen' : '',
        confirmPassword: confirmPassword === '' ? 'Gelieve uw wachtwoord te bevestigen' : '',
      });
    } else if (password !== confirmPassword) {
      setError({ ...error, confirmPassword: 'Wachtwoorden komen niet overeen' });
    } else {
      setLoading(true);
      try {
        // Register the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          console.error('Error signing up:', signUpError.message);
          const errorMessage = errorMessages[signUpError.message] || 'Er is iets misgegaan. Probeer het opnieuw.';
          Alert.alert('Er is iets misgegaan', errorMessage);
        } else {
          // Check if profile exists
          const user = signUpData.user;
          const { data: profileData, error: profileFetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileFetchError && profileFetchError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileFetchError.message);
            Alert.alert('Er is iets misgegaan', 'Kon profiel niet ophalen. Probeer het opnieuw.');
          } else if (profileData) {
            // Profile exists, update it
            const { error: profileUpdateError } = await supabase
              .from('profiles')
              .update({ username, full_name: fullName })
              .eq('id', user.id);

            if (profileUpdateError) {
              console.error('Error updating profile:', profileUpdateError.message);
              Alert.alert('Er is iets misgegaan', 'Kon profiel niet bijwerken. Probeer het opnieuw.');
            } else {
              console.log('Profile updated successfully', profileData);
              setSession(signUpData.session);
              router.push('/profile/profilescreen');
            }
          } else {
            // Profile does not exist, insert new profile
            const { error: profileInsertError } = await supabase
              .from('profiles')
              .insert([{ id: user.id, username, full_name: fullName }]);

            if (profileInsertError) {
              console.error('Error inserting profile:', profileInsertError.message);
              Alert.alert('Er is iets misgegaan', 'Kon profiel niet aanmaken. Probeer het opnieuw.');
            } else {
              console.log('Registration successful', signUpData);
              setSession(signUpData.session);
              router.push('/profile/profilescreen');
            }
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
        Alert.alert('Er is iets misgegaan. Probeer het opnieuw.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Registreren', 
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
      <Image source={require('../../../assets/images/Logo.png')} style={styles.logo} />
      <Text style={styles.label}>Gebruikersnaam *</Text>
      <TextInput
        style={[styles.input, error.username && styles.inputError]}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {error.username ? <Text style={styles.errorText}>{error.username}</Text> : null}

      <Text style={styles.label}>Voornaam en Naam *</Text>
      <TextInput
        style={[styles.input, error.fullName && styles.inputError]}
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      {error.fullName ? <Text style={styles.errorText}>{error.fullName}</Text> : null}
      
      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={[styles.input, error.email && styles.inputError]}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {error.email ? <Text style={styles.errorText}>{error.email}</Text> : null}
      
      <Text style={styles.label}>Wachtwoord *</Text>
      <TextInput
        style={[styles.input, error.password && styles.inputError]}
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {error.password ? <Text style={styles.errorText}>{error.password}</Text> : null}
      
      <Text style={styles.label}>Bevestig wachtwoord *</Text>
      <TextInput
        style={[styles.input, error.confirmPassword && styles.inputError]}
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      {error.confirmPassword ? <Text style={styles.errorText}>{error.confirmPassword}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Eventjes geduld...' : 'Maak aan'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.white,  
  },
  logo: {
    width: wp('70%'),
    height: hp('20%'),
    marginBottom: 40,
    resizeMode: 'contain',
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
  inputError: {
    borderColor: 'red',
    fontFamily: 'Roboto-Regular',
    alignSelf: 'flex-start',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    alignSelf: 'flex-start',
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

export default RegisterScreen;
