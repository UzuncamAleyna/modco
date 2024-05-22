// Banner.tsx
import React, { useState } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

// Example banner data
const banners = [
  require('assets/images/pink-dress.jpg'),
  require('assets/images/pink-dress.jpg'),
  require('assets/images/pink-dress.jpg'),
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width); 
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
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
        {banners.map((_, index) => (
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
    width: 385, // this will make the image take up the full width of the screen with a margin of 20 on each side, so the image will be centered
    height: 100, 
    borderRadius: 5,
    marginRight: 20,
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
