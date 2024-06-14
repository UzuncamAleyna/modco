import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import ProductListItem from './ProductListItem';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProductListSection = ({ title }) => {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('fashion_items')
        .select(`
          id,
          title,
          description,
          price,
          shops(name),
          fashion_item_photos(url)
        `);

      if (error) {
        console.error('Error fetching items:', error.message);
      } else {
        console.log('Fetched Items:', JSON.stringify(data, null, 2));
        setItems(data);
      }
    };
    fetchItems();
  }, []);

  const handleDiscoverMore = () => {
    router.push({
      pathname: `/home/section/${title}`,
      params: { items: JSON.stringify(items) }
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.scrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.slice(0, 5).map((item, index) => (
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
