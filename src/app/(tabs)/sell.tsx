import Colors from '@/src/constants/Colors';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import SellList from '@/src/components/SellScreen/SellList';

export default function Sell() {
  return (
    <View style={styles.container}>
      <SellList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
