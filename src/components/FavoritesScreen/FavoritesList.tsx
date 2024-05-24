import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import FavoritesListItem from './FavoritesListItem';
import Colors from '@/src/constants/Colors';
const PinkDress = require('../../../assets/images/pink-dress.jpg');


const favoriteItems = [
    {
        id: '1',
        name: 'Product 1',
        sizes: ['XS', 'S', 'M', 'L'],
        price: '€ 22',
        imageUrl: PinkDress,
    },
    {
        id: '2',
        name: 'Product 2',
        sizes: ['XS', 'S', 'M', 'L'],
        price: '€ 22',
        imageUrl: PinkDress,
    },
];

const FavoritesList = () => {
    const handleBuyPress = (id: string) => {
        console.log(`Buy pressed for item ${id}`);
        // Voeg hier de koopactie toe
    };

    const handleClosePress = (id: string) => {
        console.log(`Close pressed for item ${id}`);
        // Wanneer ik sluit, moet de favoriet worden verwijderd
        
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favoriteItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FavoritesListItem
                        name={item.name}
                        sizes={item.sizes}
                        price={item.price}
                        imageUrl={item.imageUrl}
                        onBuyPress={() => handleBuyPress(item.id)}
                        onClosePress={() => handleClosePress(item.id)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
});

export default FavoritesList;
