import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import FavoritesList from '@/src/components/FavoritesScreen/FavoritesList';

export default function Favorites() {
  return (
    <View style={styles.container}>
      <FavoritesList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
