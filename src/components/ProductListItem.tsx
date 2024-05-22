import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import Colors from '@/src/constants/Colors';
import { Item } from '../types';
import Icon from 'react-native-vector-icons/Octicons'; 


type ProductListItemProps = { 
    item: Item;
};

const ProductListItem = ({item}: ProductListItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <TouchableOpacity style={styles.heartButton}>
        <Icon name="heart" size={24} color={Colors.blueIris} />
      </TouchableOpacity>
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
    position: 'relative',
    
  },
  heartButton: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
    opacity: 0.8,

  },
  title: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Roboto-Light',

  },
  image: {
    width: 175,
    height: 245,
    borderRadius: 5,
    marginBottom: 10,
  },
  brand: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
  },
  price: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Roboto-Bold',
  },
});
