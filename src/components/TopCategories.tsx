import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import CategoryItem from './CategoryItem';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

type TopCategoriesSectionProps = {
  title: string;
  selectedTab: string;
};

type CategoryItemType = {
  id: string;
  name: string;
  image: string;
  sales_count: number;
};

interface Subcategory {
  id: string;
  name: string;
  gender: string;
}

const TopCategories: React.FC<TopCategoriesSectionProps> = ({ title, selectedTab }) => {
  const [categories, setCategories] = useState<CategoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('fashion_items')
          .select(`
            subcategory_id,
            subcategories (id, name, gender),
            sales_count,
            fashion_item_photos (url)
          `)
          .order('sales_count', { ascending: false });

        if (error) {
          throw error;
        }

        const groupedData = data.reduce((acc: Record<string, CategoryItemType>, item) => {
          const subcategoryId = item.subcategory_id;
          const subcategory = item.subcategories;
          const randomImage = item.fashion_item_photos.length
            ? item.fashion_item_photos[Math.floor(Math.random() * item.fashion_item_photos.length)].url
            : '';

          if (subcategory && subcategory.gender === selectedTab) {
            if (!acc[subcategoryId]) {
              acc[subcategoryId] = {
                id: subcategory.id,
                name: subcategory.name,
                image: randomImage,
                sales_count: item.sales_count,
              };
            } else {
              acc[subcategoryId].sales_count += item.sales_count;
            }
          }
          return acc;
        }, {});

        const topCategories = Object.values(groupedData)
          .sort((a, b) => b.sales_count - a.sales_count)
          .slice(0, 5);

        setCategories(topCategories);
      } catch (error) {
        console.error('Error fetching top categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCategories();
  }, [selectedTab]);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.blueIris} />;
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            categoryitem={category}
            onPress={() => router.push({
              pathname: `/search/fashionitems/${category.id}`,
              params: { subcategoryId: category.id, subcategoryName: category.name }
            })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    color: Colors.black,
    marginBottom: 10,
  },
  mainContainer: {
    marginBottom: 20,
    backgroundColor: Colors.lightPurple,
    padding: 20,
    borderRadius: 5,
  },
});

export default TopCategories;
