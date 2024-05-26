import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import ProductListItem from './ProductListItem';
import items from '../../assets/data/clothingItems';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

type ProductListSectionProps = {
  title: string;
  items: Array<any>; 
};

const ProductListSection: React.FC<ProductListSectionProps> = ({ title }) => {
  const router = useRouter();

  const handleDiscoverMore = () => {
    router.push(`/home/section/${title}`);
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item, index) => (
            <ProductListItem key={index} item={item} />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleDiscoverMore}>
          <Text style={styles.buttonText}>Ontdek meer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    marginBottom: 10,
  },
  scrollContainer: {
    height: hp('41%'), 
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
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});

export default ProductListSection;
