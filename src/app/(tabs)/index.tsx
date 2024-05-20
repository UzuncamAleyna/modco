import { StyleSheet, Image, ScrollView } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import Colors from '@/src/constants/Colors';
import items from '../../../assets/data/clothingItems';


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

export default function Home() {
  return (
    <ScrollView horizontal style={styles.container}>
      <ProductListItem item={items[0]} />
      <ProductListItem item={items[1]} />
      <ProductListItem item={items[2]} />
      <ProductListItem item={items[3]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    flex: 1,
    flexDirection: 'row',
  },
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
