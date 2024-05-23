import Colors from '@/src/constants/Colors';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { Text, View } from 'react-native';
import ProfileList from '@/src/components/ProfileScreen/ProfileList';

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      <Image source={require('../../../assets/images/jurk.jpg')} style={styles.image} />
      <Text style={styles.user}>Esmée Rose</Text>
      <View style={styles.seperator} />
      <ProfileList/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  user: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,

  },
  seperator: {
    backgroundColor: Colors.lightGrey,
    height: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: '35%',
    height: 135,
    resizeMode: 'cover',
    borderRadius: 1000,
    alignSelf: 'center',
    marginTop: 20,
  },
});
