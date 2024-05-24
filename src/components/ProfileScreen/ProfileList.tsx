import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { SearchItemType } from '../../types';
import ProfileListItem from './ProfileListItem';

const profileOptions: SearchItemType[] = [
    { name: 'Mijn Gegevens' },
    { name: 'Mijn Bestellingen' },
    { name: 'Mijn Retouren' },
    { name: 'Mijn Shop' },
    { name: 'Wachtwoord Wijzigen' },
    { name: 'Volgend' },
    { name: 'Over MODCO' },
    { name: 'MODCO Premium' },
    { name: 'Privacybeleid' },
    { name: 'Uitloggen' },
];

const ProfileList = () => {
    const handlePress = (option: string) => {
        console.log('Pressed:', option);
        // Here you can navigate to a specific screen or perform an action
    };

    return (
        <View style={styles.container}>
            {profileOptions.map((option, index) => (
                <ProfileListItem
                    key={index}
                    name={option.name}
                    onPress={() => handlePress(option.name)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
});

export default ProfileList;
