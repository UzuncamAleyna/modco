import { StyleSheet, ScrollView } from 'react-native';
import Colors from '@/src/constants/Colors';
import items from '../../../assets/data/clothingItems';
import ProductListSection from '@/src/components/ProductListSection';

export default function Home() {
  // console.log('Items:', items);
  return (
    <ScrollView style={styles.container}>
      <ProductListSection title={'Nieuw'} items={items} />
      <ProductListSection title={'Bestseller'} items={items} />
      <ProductListSection title={'Aanbiedingen'} items={items} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
  },
});
