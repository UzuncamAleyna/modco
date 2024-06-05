import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import shopData from '../../../../../../assets/data/shopsData';

const CollectionsList = () => {
  const { id } = useLocalSearchParams();
  const shop = shopData.find(shop => shop.id.toString() === id);
  const router = useRouter();

  if (!shop) {
    return (
      <View>
        <Text>Shop not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${shop.name} Collecties`,
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Icon name="chevron-left" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        data={shop.collections}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.collectionContainer} onPress={() => router.push(`/search/shops/${id}/collections/${item.name}`)}>
            <Text style={styles.collectionName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  collectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  collectionName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default CollectionsList;
