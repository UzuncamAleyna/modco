import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons'; 
import Colors from '@/src/constants/Colors';
import { setLoggedIn } from '@/src/authState';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleLogin = () => {
    // Validatie logica
    if (email === '' || password === '') {
      setError({
        email: email === '' ? 'Gelieve uw e-mail in te vullen' : '',
        password: password === '' ? 'Gelieve uw wachtwoord in te vullen' : '',
      });
    } else {
      // Sign-in logica
      console.log('Sign-In Succesvol');
      setLoggedIn(true);
      router.push('/profile');
    }
  };

  return (
    <View style={styles.container}>
        <Stack.Screen 
        options={{ 
          title: 'login', 
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>wachtwoord vergeten</Text>
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
  forgotPassword: {
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  backButton: {
    marginLeft: 10,
  },
});

export default LoginScreen;
