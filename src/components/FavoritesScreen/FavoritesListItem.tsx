import React,  { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/src/constants/Colors';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

interface FavoritesListItemProps {
    name: string;
    sizes: string[];
    price: string;
    imageUrl: any;
    onBuyPress: () => void;
    onClosePress: () => void;
}

const FavoritesListItem: React.FC<FavoritesListItemProps> = ({ name, sizes, price, imageUrl, onBuyPress, onClosePress }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleSizePress = (size: string) => {
        setSelectedSize(size);
    };
    return (
        <View style={styles.container}>
            <Image source={ imageUrl } style={styles.image} />
            <View style={styles.contentContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.price}>{price}</Text>
                    <View style={styles.sizesContainer}>
                {sizes.map((size, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => handleSizePress(size)} 
                        style={[
                            styles.sizeButton, 
                            { borderColor: size === selectedSize ? 'blueIris' : 'black' }
                        ]}
                    >
                        <Text style={styles.sizeText}>{size}</Text>
                    </TouchableOpacity>
                ))}
            </View>
                    <TouchableOpacity onPress={onBuyPress} style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>Koop</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={onClosePress} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
        width: wp('100%'),
    },
    image: {
        width: wp('30%'),
        height: hp('18%'),
        marginRight: 10,
        borderRadius: 5,
    },
    contentContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
        flex: 1,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '200',
        fontSize: 16,
        marginBottom: 14,
    },
    price: {
        fontSize: 16,
        marginBottom: 14,
        fontFamily: 'Roboto-Bold',
    },
    sizes: {
        fontSize: 14,
        marginBottom: 14,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buyButton: {
        backgroundColor: Colors.black,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',

    },
    buyButtonText: {
        color: Colors.white,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
   },
   sizesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    },
    sizeButton: {
        borderWidth: 0.25,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        width: 40,
        alignItems: 'center',
    },
    sizeText: {
        color: Colors.black,
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
    },
});

export default FavoritesListItem;
