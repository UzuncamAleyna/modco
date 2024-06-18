import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Octicons';

import Colors from '@/src/constants/Colors';
import CategoryListItem from '../../../../components/SearchScreen/CategoryListItem';
import { Subcategory } from '@/src/types';

const SubcategoryList = () => {
  const { category, subcategories } = useLocalSearchParams();
  const parsedSubcategories: Subcategory[] = JSON.parse(subcategories as string);
  const router = useRouter();

  const handlePress = (subcategory: Subcategory) => {
    router.push({
      pathname: `/search/fashionitems/${subcategory.id}`,
      params: { subcategoryId: subcategory.id, gender: subcategory.gender, subcategoryName: subcategory.name },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: Array.isArray(category) ? category[0] : category,
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
        data={parsedSubcategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryListItem searchitem={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
});

export default SubcategoryList;
