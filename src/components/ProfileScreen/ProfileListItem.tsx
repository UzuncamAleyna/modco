import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

type ProfileListItemProps = {
    name: string;
    onPress: () => void;
    icon: string;
};

const ProfileListItem = ({ name, onPress, icon }: ProfileListItemProps) => {
    return (
        <Pressable onPress={onPress} style={styles.itemContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.leftContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name={icon} size={24} style={styles.icon} />
                    </View>
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
    iconContainer: {
        width: 30,
        alignItems: 'center',
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
