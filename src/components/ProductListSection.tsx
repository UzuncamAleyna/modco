import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import ProductListItem from './ProductListItem';
import items from '../../assets/data/clothingItems';
import Colors from '../constants/Colors';


type ProductListSectionProps = {
    title: string;
    items: Array<any>; 
  };

const ProductListSection: React.FC<ProductListSectionProps> = ({ title }) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item, index) => (
            <ProductListItem key={index} item={item} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>Ontdek meer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
};
const styles = StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.blueIris,
      marginBottom: 10,
    },
    scrollContainer: {
      height: 380, 
    },
    button: {
      padding: 10,
      borderRadius: 5,
      bottom: 10,
      borderColor: Colors.black,
      borderWidth: 1,
    },
    buttonText: {
      color: Colors.black,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });


export default ProductListSection;