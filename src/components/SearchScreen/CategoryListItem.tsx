import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { SearchItemType } from '../../types';

type CategoryListItemProps = {
    searchitem: SearchItemType;
    onPress: () => void;
}

const CategoryListItem = ({ searchitem, onPress }: CategoryListItemProps) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.text}>{searchitem.name}</Text>
                <MaterialIcons name="arrow-forward-ios" size={20} style={styles.icon} />
            </View>
            <View style={styles.seperator} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
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
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
});

export default CategoryListItem;
