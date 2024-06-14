import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';

const OrdersList = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        fashion_items (
          id,
          title,
          shop_id
        )
      `)   
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching orders:', error.message);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/profile/orderdetail/${item.id}`)} style={styles.orderItem}>
      <Image source={{ uri: item.image }} style={styles.orderImage} />
      <View style={styles.orderDetails}>
        <Text style={styles.orderStatus}>{item.orderstatus}</Text>
        <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.orderName}>{item.fashion_items.title}</Text>
        <Text style={styles.orderPrice}>€ {item.price}</Text>
        <Text style={styles.orderId}>Bestelnummer: {item.order_id}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.black} />
    </TouchableOpacity>
  );

  if (loading) {
    return <Text>Aan het laden...</Text>;
  }

  if (orders.length === 0) {
    return <Text>Geen bestellingen gevonden</Text>;
  }

  return (
    <View style={styles.orderContainer}>
      <Stack.Screen
        options={{
          title: 'Mijn Bestellingen',
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
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    padding: 20,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  orderImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  orderDetails: {
    flex: 1,
  },
  orderStatus: {
    color: Colors.blueIris,
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
  },
  orderDate: {
    color: Colors.grey,
    fontSize: 12,
    marginBottom: 5,
  },
  orderName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 5,
  },
  orderPrice: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
  },
  orderId: {
    fontSize: 12,
    color: Colors.grey,
  },
});

export default OrdersList;
