import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const ShopScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hier zijn alle winkels!</Text>
            {/* Voeg meer inhoud toe als dat nodig is */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    text: {
        fontSize: 20,
        fontFamily: 'Roboto-Regular',
        color: Colors.black,
    },
});

export default ShopScreen;
