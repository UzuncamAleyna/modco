import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import SvgComponent from '../Icons/ProfileIcon';


type ProfileListItemProps = {
    name: string;
    onPress: () => void;

};

const ProfileListItem = ({ name, onPress }: ProfileListItemProps) => {
    return (
        <Pressable onPress={onPress} style={styles.itemContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.leftContainer}>
                    <SvgComponent />
                    <Text style={styles.text}>{name}</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={20} style={styles.icon} />
            </View>
            <View style={styles.seperator} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        marginLeft: 10,
    },
    seperator: {
        backgroundColor: Colors.lightGrey,
        height: 1,
        width: '100%',
        marginTop: 15,
    },
    icon: {
        color: Colors.blueIris,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfileListItem;
