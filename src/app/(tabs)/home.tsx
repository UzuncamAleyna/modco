import { StyleSheet, ScrollView } from 'react-native';
import Colors from '@/src/constants/Colors';
import items from '../../../assets/data/clothingItems';
import ProductListItem from '@/src/components/ProductListItem';


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
});
