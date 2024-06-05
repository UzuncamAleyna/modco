import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Colors from '@/src/constants/Colors';
import SellList from '@/src/components/SellScreen/SellList';
import { useAuth } from '@/src/providers/AuthProvider';
import Icon from 'react-native-vector-icons/Octicons'; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Sell() {
  const { session, isDesigner } = useAuth();
  const router = useRouter();

  if (!session) {
    return (
      <View style={styles.authContainer}>
         <Stack.Screen
          options={{ 
            headerTitle: 'Verkopen', 
            headerTitleStyle: {
              fontFamily: 'PPMonumentExtended-Regular',
              fontSize: 14,
            }, 
          }}
        />
      <Icon name="smiley" size={80} color={Colors.blueIris} style={styles.logo} />
      <Text style={styles.title}>U bent nog niet ingelogd...</Text>
      <Text style={styles.description}>
      Om een winkel te starten, moet u eerst inloggen of een account aanmaken.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
        <Text style={styles.buttonText}>Maak een account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
        <Text style={[styles.buttonText, styles.loginButtonText]}>Log in</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Door verder te gaan, gaat u akkoord met onze{' '}
        <Text style={styles.link}>Servicevoorwaarden</Text> en{' '}
        <Text style={styles.link}>Privacybeleid</Text>.
      </Text>
    </View>
    );
  }

  if (isDesigner) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{ 
            headerTitle: 'Verkopen', 
            headerTitleStyle: {
              fontFamily: 'PPMonumentExtended-Regular',
              fontSize: 14,
            }, 
          }}
        />
        <SellList />
      </View>
    );
  }

  return (
    <View style={styles.sellContainer}>
      <Stack.Screen
        options={{ 
          headerTitle: 'Verkopen', 
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          }, 
        }}
      />
      <Text style={styles.title}>Bent u een ontwerper? Start uw winkel nu!</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/sell/createShop/create-shop')}>
        <Text style={styles.buttonText}>Winkel starten</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  sellContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: wp('90%'),
    height: hp('5%'),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  loginButtonText: {
    color: Colors.black,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.grey,
  },
  link: {
    color: Colors.blueIris,
  },
});
