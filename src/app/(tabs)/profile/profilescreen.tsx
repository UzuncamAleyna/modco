import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/src/constants/Colors';
import ProfileList from '@/src/components/ProfileScreen/ProfileList';
import Icon from 'react-native-vector-icons/Octicons'; 
import { Stack, useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/lib/supabase';

export default function Profile() {
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setUsername(profileData.username);
      setFullName(profileData.full_name);
      setAvatarUrl(profileData.avatar_url);
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map((word) => word[0]).join('');
    return initials.toUpperCase();
  };

  if (!session) {
    return (
      
      <View style={styles.container}>
      <Stack.Screen
        options={{ 
          headerTitle: 'Zoeken',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
        }}
      />
        <Icon name="smiley" size={80} color={Colors.blueIris} style={styles.logo} />
        <Text style={styles.title}>U bent nog niet ingelogd...</Text>
        <Text style={styles.description}>
          Om toegang te krijgen tot je profiel, log eerst in of registreer je nu! Hier kun je je persoonlijke gegevens beheren en je bestelgeschiedenis bekijken.
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

  return (
    <ScrollView style={styles.profileContainer}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.image} />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials(fullName)}</Text>
        </View>
      )}
      <Text style={styles.user}>{fullName}</Text>
      <View style={styles.separator} />
      <ProfileList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  profileContainer: {
    backgroundColor: Colors.white,
    flex: 1,
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
  image: {
    width: '25%',
    height: 105,
    resizeMode: 'cover',
    borderRadius: 1000,
    alignSelf: 'center',
    marginTop: 20,
  },
  initialsContainer: {
    width: 105,
    height: 105,
    borderRadius: 1000,
    backgroundColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  initialsText: {
    fontSize: 36,
    color: Colors.white,
    fontFamily: 'Roboto-Bold',
  },
  user: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  separator: {
    backgroundColor: Colors.lightGrey,
    height: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});
