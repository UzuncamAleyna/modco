import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';


const PrivacyPolicy = () => {
  const router = useRouter();

  const handleEmailPress = () => {
    const email = 'klantenservice@modco.com';
    const subject = 'Privacybeleid Vraag';
    const body = 'Ik heb een vraag over het privacybeleid van MODCO.';
    const mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailUrl).catch((err) => {
      console.error('Error opening email:', err);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Privacybeleid',
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
          Bij MODCO hechten we veel waarde aan de privacy van onze gebruikers. Dit privacybeleid beschrijft hoe we omgaan met uw persoonlijke gegevens en hoe we uw privacy beschermen.
        </Text>
        <Text style={styles.paragraph}>
          Wij verzamelen en gebruiken uw persoonlijke gegevens uitsluitend voor het leveren van onze diensten en het verbeteren van uw winkelervaring. Uw gegevens worden veilig opgeslagen en nooit gedeeld met derden zonder uw uitdrukkelijke toestemming.
        </Text>
        <Text style={styles.paragraph}>
          Voor meer informatie over ons privacybeleid, kunt u contact met ons opnemen via onze klantenservice.
        </Text>
        <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
          <Text style={styles.emailButtonText}>Stuur een e-mail naar klantenservice</Text>
        </TouchableOpacity>
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
  emailButton: {
    marginTop: 20,
    backgroundColor: Colors.blueIris,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emailButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default PrivacyPolicy;
