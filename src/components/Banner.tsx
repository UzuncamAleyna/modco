import React, { useState } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const banners = {
  Dames: [
    require('assets/images/damesbanner1.jpg'),
    require('assets/images/damesbanner2.jpg'),
    require('assets/images/damesbanner3.jpg'),
  ],
  Heren: [
    require('assets/images/herenbanner1.jpg'),
    require('assets/images/herenbanner2.jpg'),
    require('assets/images/herenbanner3.jpg'),
  ],
};

const Banner = ({ selectedTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width); 
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={banners[selectedTab]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(_, index) => index.toString()} 
        renderItem={({ item }) => (
          <Image source={item} style={styles.image} />
        )}
      />
      <View style={styles.pageControl}>
        {banners[selectedTab].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  image: {
    width: wp('90%'),
    height: 100, 
    borderRadius: 5,
    marginRight: 10,
  },
  pageControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightPurple,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.blueIris,
  },
});

export default Banner;
