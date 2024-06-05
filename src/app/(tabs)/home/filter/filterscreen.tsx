// src/app/(tabs)/home/filter.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import Icon from 'react-native-vector-icons/AntDesign'; 
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CategoryListItem from '../../../../components/SearchScreen/CategoryListItem';
import { SearchItemType } from '@/src/types';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const categories: SearchItemType[] = [
  { name: 'Categorie' },
  { name: 'Kleur' },
  { name: 'Maat' },
  { name: 'Stijl' },
  { name: 'Materiaal' },
  { name: 'Lengte' },
];

const Filter = () => {
  const [priceRange, setPriceRange] = useState([3, 500]);
  const router = useRouter();

  const handleValuesChange = (values) => {
    setPriceRange(values);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Filter op',
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <Icon name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      {categories.map((category, index) => (
        <CategoryListItem
          key={index}
          searchitem={category}
          onPress={() => console.log(`Selected: ${category.name}`)}
        />
      ))}
      <View style={styles.priceRangeContainer}>
        <Text style={styles.optionText}>Prijs</Text>
        <MultiSlider
          values={priceRange}
          sliderLength={wp('90%')}
          onValuesChange={handleValuesChange}
          min={1}
          max={500}
          step={1}
          selectedStyle={{
            backgroundColor: Colors.blueIris,
          }}
          unselectedStyle={{
            backgroundColor: Colors.lightGrey,
          }}
          markerStyle={{
            backgroundColor: Colors.blueIris,
            height: 20,
            width: 20,
            borderRadius: 10,
          }}
        />
        <View style={styles.priceRangeLabels}>
          <Text>€ {priceRange[0]}</Text>
          <Text>€ {priceRange[1]}</Text>
        </View>
      </View>
      <View style={styles.seperator} />
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Filters toepassen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 10,
  },
  filterOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
  },
  priceRangeContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: Colors.black,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  seperator: {
    backgroundColor: Colors.lightGrey,
    height: 1,
    width: '100%',
    marginTop: 15,
  },
});

export default Filter;
