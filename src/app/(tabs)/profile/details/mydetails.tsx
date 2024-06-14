import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';
import Colors from '@/src/constants/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

const ProfileDetailsScreen = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setFullName(data.full_name);
          console.log('Full Name:', data.full_name);
          setUsername(data.username);
          console.log('Username:', data.username);
          setEmail(session.user.email);
            console.log('Email:', session.user.email);
            setAvatarUrl(data.avatar_url);
            console.log('Avatar URL:', data.avatar_url);
        }
      };

      fetchProfile();
    }
  }, [session]);

  const getInitials = (name) => {
    const names = name.split(' ');
    let initials = names.map((n) => n[0]).join('');
    return initials.toUpperCase();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = await (await fetch(result.assets[0].uri)).blob();
      const imageName = `${session.user.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(imageName, decode(base64), { contentType: 'image' });

      if (error) {
        console.error('Error uploading avatar:', error.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(imageName);
        console.log('Public URL:', publicUrlData.publicUrl);
        setAvatarUrl(publicUrlData.publicUrl);
      }
    }
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username, avatar_url: avatarUrl })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
      Alert.alert('Er is iets misgegaan', 'Kon profiel niet bijwerken. Probeer het opnieuw.');
    } else {
      Alert.alert('Profiel bijgewerkt', 'Je profiel is succesvol bijgewerkt.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Mijn Gegevens', 
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
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initials}>{getInitials(fullName)}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Ionicons name="add-circle" size={24} color="gray" />
          <Text style={styles.photoButtonText}>Foto toevoegen</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Voornaam en Naam</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={styles.label}>Gebruikersnaam</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={false}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.white,
  },
  backButton: {
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: wp('25%'),
    height: 105,
    borderRadius: 50,
  },
  initialsCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.white,
    fontSize: 36,
    fontFamily: 'Roboto-Bold',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  photoButtonText: {
    marginLeft: 5,
    color: 'gray',
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
});

export default ProfileDetailsScreen;
