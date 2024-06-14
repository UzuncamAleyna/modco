import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import Colors from '@/src/constants/Colors';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/providers/AuthProvider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface FavoritesListItemProps {
    fashionItemId: string;
    name: string;
    sizes: string[];
    price: string;
    imageUrl: { uri: string } | null;
    onBuyPress: (clientSecret: string) => void;
    onClosePress: () => void;
}

const FavoritesListItem: React.FC<FavoritesListItemProps> = ({ fashionItemId, name, sizes, price, imageUrl, onBuyPress, onClosePress }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const router = useRouter();
    const { session } = useAuth();

    const handleSizePress = (size: string) => {
        setSelectedSize(size);
    };

    const handleBuyPress = async () => {
        if (!selectedSize) {
            Alert.alert('Error', 'Gelieve een maat te selecteren');
            return;
        }

        const response = await axios.post('http://192.168.129.6:3000/create-payment-intent', {
            amount: parseFloat(price) * 100,
            currency: 'eur', 
        });

        const { clientSecret } = response.data;

        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'MODCO',
            returnURL: 'myapp://home',
        });

        if (!error) {
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                Alert.alert('Error', 'Er is iets misgegaan bij het betalen.');
            } else {
                Alert.alert('Success', 'Betaling geslaagd');

                // Save order to database
                await axios.post('http://192.168.129.6:3000/save-order', {
                    userId: session.user.id,
                    fashionItemId: fashionItemId,
                    price: parseFloat(price),
                    size: selectedSize,
                    imageUrl: imageUrl.uri
                });

                // Redirect to home screen
                router.push('/home');
            }
        } else {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {imageUrl && <Image source={imageUrl} style={styles.image} />}
            <View style={styles.contentContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.price}>€ {price}</Text>
                    <View style={styles.sizesContainer}>
                        {sizes.length > 0 ? (
                            sizes.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSizePress(size)}
                                    style={[
                                        styles.sizeButton,
                                        {
                                            borderColor: size === selectedSize ? Colors.blueIris : Colors.black,
                                            borderWidth: size === selectedSize ? 2 : 0.25, 
                                        }
                                    ]}
                                >
                                    <Text style={styles.sizeText}>{size}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noSizesText}>Geen maten beschikbaar</Text>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleBuyPress} style={styles.buyButton}>
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
        backgroundColor: Colors.white,
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
    noSizesText: {
        fontSize: 12,
        color: Colors.grey,
        fontFamily: 'Roboto-Regular',
    },
});

export default FavoritesListItem;
