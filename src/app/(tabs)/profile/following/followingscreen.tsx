// app/(tabs)/profile/followedShops.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

const FollowedShopsScreen = () => {
  const [followedShops, setFollowedShops] = useState([]);
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchFollowedShops();
    }
  }, [session]);

  const fetchFollowedShops = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select('shop_id, shops (id, name, image)')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching followed shops:', error);
    } else {
      setFollowedShops(data.map(follow => follow.shops));
    }
  };

  const handleFollow = async (shopId, isFollowing) => {
    if (isFollowing) {
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('shop_id', shopId)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error unfollowing shop:', error);
      } else {
        setFollowedShops(followedShops.filter(shop => shop.id !== shopId));
      }
    } else {
      const { error } = await supabase
        .from('followers')
        .insert({ shop_id: shopId, user_id: session.user.id });

      if (error) {
        console.error('Error following shop:', error);
      } else {
        fetchFollowedShops();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Volgend',
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
        data={followedShops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shopContainer}>
            <Image source={{ uri: item.image }} style={styles.shopImage} />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{item.name}</Text>
            </View>
            <TouchableOpacity
              style={[styles.followButton, followedShops.some(shop => shop.id === item.id) && styles.followingButton]}
              onPress={() => handleFollow(item.id, followedShops.some(shop => shop.id === item.id))}
            >
              <Text style={styles.followButtonText}>
                {followedShops.some(shop => shop.id === item.id) ? 'Ontvolgen' : 'Volgen'}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: Colors.lightGrey, marginVertical: 10 }} />
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
  shopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  followButton: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 5,
    borderColor: Colors.black,
    borderWidth: 1,
  },
  followingButton: {
    backgroundColor: Colors.black,
    padding: 5,
    borderRadius: 5,
  },
  followButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  seperator: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginVertical: 10,
  },
});

export default FollowedShopsScreen;
