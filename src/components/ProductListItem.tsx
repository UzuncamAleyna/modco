import { StyleSheet, Image, ScrollView } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';


const ProductListItem = ({item}: {item: any}) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>€ {item.price}</Text>
    </View>
  );
}

export default ProductListItem;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
    borderRadius: 5,
    paddingRight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'regular',
    color: 'Colors.light.tint',
    fontFamily: 'Roboto',

  },
  image: {
    width: 162,
    height: 245,
    borderRadius: 5,
    marginBottom: 10,
  },
  brand: {
    fontSize: 18,
    color: Colors.light.tint,
  },
  price: {
    fontSize: 18,
    color: Colors.light.tint,
  },
});
