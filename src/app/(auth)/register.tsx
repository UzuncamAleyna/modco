import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons'; 
import Colors from '@/src/constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {supabase} from '../../lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

// Error messages from Supabase translated to Dutch
const errorMessages = {
    'Password should be at least 6 characters.': 'Wachtwoord moet minimaal 6 tekens bevatten.',
    'Unable to validate email address: invalid format': 'Kan e-mailadres niet valideren: ongeldig formaat',
    'User already registered': 'Deze email is al in gebruik',
    };

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession }:any = useAuth();

  const handleRegister = async () => {
    // Validatie logica
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      setError({
        username: username === '' ? 'Gelieve uw gebruikersnaam in te vullen' : '',
        email: email === '' ? 'Gelieve uw e-mail in te vullen' : '',
        password: password === '' ? 'Gelieve uw wachtwoord in te vullen' : '',
        confirmPassword: confirmPassword === '' ? 'Gelieve uw wachtwoord te bevestigen' : '',
      });
    } else if (password !== confirmPassword) {
      setError({ ...error, confirmPassword: 'Wachtwoorden komen niet overeen' });
    } else {
      setLoading(true);
      // Register logica met Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        // Log error message in console
        console.error('Error signing up:', signUpError.message);
        const errorMessage = errorMessages[signUpError.message] || 'Er is iets misgegaan. Probeer het opnieuw.';
        Alert.alert('Er is iets misgegaan', errorMessage)
      } else {
        // Registered successfully
        console.log('Registration successful', data);
        setSession(data.session);
        router.push('/profile');
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
