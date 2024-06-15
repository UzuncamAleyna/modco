// src/app/(tabs)/profile/over/OverMODCO.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

const OverMODCO = () => {
    const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Over MODCO',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contentContainer}>
        <Image source={require('../../../../../assets/images/Logo.png')} style={styles.logo} />
        <Text style={styles.paragraph}>
          MODCO is een toonaangevende modeapplicatie die de nieuwste trends en stijlen biedt voor opkomende modeontwerpers in België. Onze missie is om een naadloze winkelervaring te bieden, met een breed scala aan unieke modeartikelen van veelbelovende ontwerpers.
        </Text>
        <Text style={styles.paragraph}>
          Bij MODCO geloven we in de kracht van mode om individualiteit en stijl uit te drukken. We zetten ons in om jou het beste van de mode te brengen, met regelmatig bijgewerkte nieuwe aankomsten en collecties om je altijd voor te blijven op de trends.
        </Text>
        <Text style={styles.paragraph}>
          Sluit je bij ons aan in het vieren van mode en stijl, en ontdek je unieke look met MODCO.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: wp('50%'), 
    height: hp('20%'), 
    resizeMode: 'contain',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 15,
    color: Colors.black,
    textAlign: 'justify',
  },
});

export default OverMODCO;
