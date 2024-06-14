import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import { supabase } from '@/src/lib/supabase';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CollectionsScreen = () => {
  const { shopId } = useLocalSearchParams();
  const [collections, setCollections] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          name,
          fashion_items (
            id,
            title,
            fashion_item_photos (url)
          )
        `)
        .eq('shop_id', shopId);

      if (error) {
        console.error('Error fetching collections:', error);
      } else {
        setCollections(data);
      }
    };
    fetchCollections();
  }, [shopId]);

  if (!collections.length) {
    return (
      <View style={styles.container}>
        <Text>Geen collecties gevonden</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Collecties',
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
        data={collections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.collectionContainer}>
            <Image
              source={{ uri: item.fashion_items[0]?.fashion_item_photos[0]?.url }}
              style={styles.collectionImage}
            />
            <View style={styles.collectionInfo}>
              <Text style={styles.collectionName}>{item.name}</Text>
              <TouchableOpacity
              style={styles.viewButton}
              onPress={() => router.push(`/search/shops/collectiondetail/${item.id}`)}
            >
              <Text style={styles.viewButtonText}>Bekijk</Text>
            </TouchableOpacity>
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
    padding: 20,
  },
  collectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingBottom: 10,
  },
  collectionImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  collectionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  viewButton: {
    backgroundColor: Colors.black,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

export default CollectionsScreen;
