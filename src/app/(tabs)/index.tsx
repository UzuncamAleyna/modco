import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import items from '../../../assets/data/clothingItems';

const item = items[0];
export default function TabOneScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nieuw</Text> 
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.title}>{item.brand}</Text>
      <Text style={styles.title}>€ {item.price}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'Colors.light.tint',
    fontFamily: 'Roboto',

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
  },
  image: {
    width: 162,
    height: 245,
    borderRadius: 5,
  },
});
