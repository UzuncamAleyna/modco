// src/app/(tabs)/home/sorteren.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/AntDesign'; 
import RadioButton from '../../../../components/RadioButton/RadioButton';
import Colors from '@/src/constants/Colors';

const Sorteren = () => {
  const [selectedOption, setSelectedOption] = useState('Must-haves');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Sorteren op',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Icon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <RadioButton
        label="Must-haves"
        selected={selectedOption === 'Must-haves'}
        onPress={() => setSelectedOption('Must-haves')}
      />
      <View style={{ height: 1, backgroundColor: Colors.lightGrey, marginVertical: 10 }} />
      <RadioButton
        label="Nieuw"
        selected={selectedOption === 'Nieuw'}
        onPress={() => setSelectedOption('Nieuw')}
      />
      <View style={{ height: 1, backgroundColor: Colors.lightGrey, marginVertical: 10 }} />
      <RadioButton
        label="Prijs: Laag naar Hoog"
        selected={selectedOption === 'Prijs: Laag naar Hoog'}
        onPress={() => setSelectedOption('Prijs: Laag naar Hoog')}
      />
      <View style={{ height: 1, backgroundColor: Colors.lightGrey, marginVertical: 10 }} />
      <RadioButton
        label="Prijs: Hoog naar Laag"
        selected={selectedOption === 'Prijs: Hoog naar Laag'}
        onPress={() => setSelectedOption('Prijs: Hoog naar Laag')}
      />
      <View style={{ height: 1, backgroundColor: Colors.lightGrey, marginVertical: 10 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
});

export default Sorteren;
