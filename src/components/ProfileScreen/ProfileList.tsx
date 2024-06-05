import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { SearchItemType } from '../../types';
import ProfileListItem from './ProfileListItem';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

const profileOptions: SearchItemType[] = [
    { name: 'Mijn Gegevens' },
    { name: 'Mijn Bestellingen' },
    // { name: 'Mijn Retouren' },
    { name: 'Mijn Shop' }, //deze kan enkel zichtbaar zijn als de gebruiker een shop heeft
    { name: 'Wachtwoord Wijzigen' },
    { name: 'Volgend' },
    { name: 'Over MODCO' },
    // { name: 'MODCO Premium' },
    { name: 'Privacybeleid' },
    { name: 'Uitloggen' },
];
const ProfileList = () => {
    const router = useRouter();
    const {session} = useAuth();

    const handlePress = async (option: string) => {
        if (option === 'Uitloggen') {
            const { error } = await supabase.auth.signOut();
            if (!error) {
                router.replace('/profile');
            } else {
                console.error('Error signing out:', error.message);
            }
        } else {
            console.log('Pressed:', option);
        }
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
