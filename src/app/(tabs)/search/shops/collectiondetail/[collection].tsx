import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import shopData from '../../../../../../assets/data/shopsData';

const CollectionItems = () => {
  const { id, collection } = useLocalSearchParams();
  const shop = shopData.find(shop => shop.id.toString() === id);
  const collectionData = shop?.collections.find(coll => coll.name === collection);

  if (!shop || !collectionData) {
    return (
      <View>
        <Text>Collection not found</Text>
      </View>
    );
  }

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
            title: collection.toString(),
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
        data={collectionData.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemPrice}>€ {item.price}</Text>
            </View>
          </View>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  itemBrand: {
    fontSize: 14,
    color: Colors.grey,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.black,
  },
});

export default CollectionItems;
