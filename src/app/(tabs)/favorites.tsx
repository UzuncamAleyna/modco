import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/lib/supabase';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FavoritesList from '@/src/components/FavoritesScreen/FavoritesList';

type FashionItemPhoto = {
  url: string;
};

type FashionItemSize = {
  size_id: string;
};

type FashionItem = {
  id: string;
  title: string;
  price: number;
  fashion_item_photos: FashionItemPhoto[];
  fashion_item_sizes: FashionItemSize[];
};

type Favorite = {
  id: string;
  fashion_items: FashionItem;
};

const Favorites = () => {
  const { session } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        fashion_items: fashion_items (
          id,
          title,
          price,
          fashion_item_photos (url),
          fashion_item_sizes (size_id)
        )
      `)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching favorites:', error.message);
    } else {
      const favoritesWithSizes = await Promise.all(data.map(async (favorite: any) => {
        const { data: sizes, error: sizeError } = await supabase
          .from('sizes')
          .select('name')
          .in('id', favorite.fashion_items.fashion_item_sizes.map((size: FashionItemSize) => size.size_id));

        if (sizeError) {
          console.error('Error fetching sizes:', sizeError.message);
        }

        return {
          ...favorite,
          fashion_items: {
            ...favorite.fashion_items,
            sizes: sizes ? sizes.map((size: any) => size.name) : []
          }
        };
      }));

      setFavorites(favoritesWithSizes);
    }
    setLoading(false);
  };

  const refreshFavorites = () => {
    fetchFavorites();
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Icon name="heart" size={80} color={Colors.blueIris} style={styles.logo} />
        <Text style={styles.title}>U bent nog niet ingelogd...</Text>
        <Text style={styles.description}>
          Om je favorieten te bekijken, log eerst in of registreer je nu! Zo kun je je favoriete items opslaan en ze later gemakkelijk terugvinden.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
          <Text style={styles.buttonText}>Maak een account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
          <Text style={[styles.buttonText, styles.loginButtonText]}>Log in</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Door verder te gaan, gaat u akkoord met onze{' '}
          <Text style={styles.link}>Servicevoorwaarden</Text> en{' '}
          <Text style={styles.link}>Privacybeleid</Text>.
        </Text>
      </View>
    );
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Icon name="heart" size={80} color={Colors.blueIris} style={styles.logo} />
        <Text style={styles.title}>Je hebt nog geen favorieten...</Text>
        <Text style={styles.description}>
          Begin met shoppen en voeg items toe aan je favorieten om ze hier te bewaren en snel weer terug te vinden.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/search')}>
          <Text style={styles.buttonText}>Begin met winkelen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FavoritesList favorites={favorites} refreshFavorites={refreshFavorites} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  logo: {
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: wp('90%'),
    height: hp('5%'),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  loginButtonText: {
    color: Colors.black,
  },
  footerText: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.grey,
  },
  link: {
    color: Colors.blueIris,
  },
});

export default Favorites;
