import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';
import { supabase } from '@/src/lib/supabase';
import Colors from '@/src/constants/Colors';

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        fashion_items (
          id,
          title,
          shop_id,
          shops (name)
        )
      `)      
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order details:', error.message);
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <Text>Aan het laden...</Text>;
  }

  if (!order) {
    return <Text>Geen bestelling gevonden.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Mijn Bestelgegevens',
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
      <View style={styles.header}>
        <Text style={styles.orderId}>Bestelling {order.order_id}</Text>
        <Text style={styles.status}>{order.orderstatus}</Text>
        <Text style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</Text>
      </View>
      {order.image && (
        <Image source={{ uri: order.image }} style={styles.image} />
      )}
      <View style={styles.infoSection}>
        <Text style={styles.itemName}>{order.fashion_items.title}</Text>
        <Text style={styles.price}>€ {order.price}</Text>
        <Text style={styles.size}>Maat: {order.size}</Text>
      </View>
      <TouchableOpacity 
        style={styles.reviewButton}
        onPress={() => router.push(`/profile/createreview/${order.id}`)}
      >
        <Text style={styles.reviewButtonText}>Beoordelen</Text>
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verkoper</Text>
        <Text style={styles.sectionContent}>{order.fashion_items.shops.name}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Betalingsgegevens</Text>
        <Text style={styles.sectionContent}>VISA</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bezorgadres</Text>
        <Text style={styles.sectionContent}>
          Aleyna Uzuncam{'\n'}
          Peerstraat 54{'\n'}
          9000, Gent{'\n'}
          Oost-Vlaanderen{'\n'}
          België{'\n'}
          +32 48956441
        </Text>
      </View>
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Subtotaal</Text>
        <Text style={styles.totalValue}>€ {order.price}</Text>
      </View>
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Levering</Text>
        <Text style={styles.totalValue}>€ 2.60</Text>
      </View>
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Totaal</Text>
        <Text style={styles.totalValue}>€ {order.price + 2.60}</Text>
      </View>
      <Text style={styles.returnPolicy}>
        Als u niet tevreden bent met uw aankoop, kunt u deze binnen 30 dagen retourneren.
      </Text>
      <TouchableOpacity style={styles.returnButton}>
        <Text style={styles.returnButtonText}>Artikel Terugsturen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    marginBottom: 20,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    color: Colors.blueIris,
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
  },
  date: {
    color: Colors.grey,
    fontSize: 12,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  infoSection: {
    marginBottom: 20,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Roboto-Bold',
  },
  size: {
    fontSize: 14,
    marginBottom: 14,
  },
  reviewButton: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: Colors.grey,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  returnPolicy: {
    fontSize: 14,
    color: Colors.grey,
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  returnButtonText: {
    color: Colors.white,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default OrderDetails;
