import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import SvgUri from 'react-native-svg-uri';

type ProfileListItemProps = {
    name: string;
    onPress: () => void;
    iconSource: any; 
};

const ProfileListItem = ({ name, onPress, iconSource }: ProfileListItemProps) => {
    return (
        <Pressable onPress={onPress} style={styles.itemContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.leftContainer}>
                    <SvgUri
                        width="30"
                        height="30"
                        source={iconSource}
                        fill={Colors.blueIris}
                    />
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
        paddingHorizontal: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default ProfileListItem;
