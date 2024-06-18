import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { ProfileItemType } from '../../types';
import ProfileListItem from './ProfileListItem';
import { useAuth } from '../../providers/AuthProvider';
import { supabase } from '../../lib/supabase';
import { Stack, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const profileOptions: ProfileItemType[] = [
    { name: 'Mijn Gegevens', icon: 'person-outline' },
    { name: 'Mijn Bestellingen', icon: 'cart-outline' },
    // { name: 'Mijn Retouren', icon: 'return-up-back-outline' },
    { name: 'Mijn Shop', icon: 'storefront-outline', requiresDesigner: true },
    { name: 'Wachtwoord Wijzigen', icon: 'lock-closed-outline' },
    { name: 'Volgend', icon: 'heart-outline' },
    { name: 'Over MODCO', icon: 'information-circle-outline' },
    // { name: 'MODCO Premium', icon: 'star-outline' },
    { name: 'Privacybeleid', icon: 'document-text-outline' },
    { name: 'Uitloggen', icon: 'log-out-outline' },
];

const ProfileList = () => {
    const router = useRouter();
    const { session } = useAuth();
    const [isDesigner, setIsDesigner] = useState(false);

    const fetchUserProfile = async () => {
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('group')
            .eq('id', session.user.id)
            .single();
    
          if (error) {
            console.error('Error fetching user profile:', error.message);
          } else if (data) {
            setIsDesigner(data.group === 'DESIGNER');
          }
        }
      };
    
      useFocusEffect(
        useCallback(() => {
          fetchUserProfile();
        }, [session])
      );

    const handlePress = async (option: string) => {
        if (option === 'Uitloggen') {
            const { error } = await supabase.auth.signOut();
            if (!error) {
                router.replace('/profile');
            } else {
                console.error('Error signing out:', error.message);
            }
        } else if (option === 'Mijn Gegevens') {
            router.push('/profile/details/mydetails');
        } else if (option === 'Wachtwoord Wijzigen') {
            router.push('/profile/password/changepassword');
        } else if (option === 'Volgend') {
            router.push('/profile/following/followingscreen');
        } else if (option === 'Mijn Bestellingen') {
            router.push('/profile/orders/orderlist');
        } else if (option === 'Mijn Shop') {
            router.push('/profile/myshop/shopscreen');
        } else if (option === 'Over MODCO') {
            router.push('/profile/about/aboutmodco');
        } else if (option === 'Privacybeleid') {
            router.push('/profile/privacy/privacypolicy');
        } else {
            console.log('Pressed:', option);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{ 
                    headerTitle: 'Mijn Profiel',
                    headerTitleStyle: {
                        fontFamily: 'PPMonumentExtended-Regular',
                        fontSize: 14,
                    },
                }}
            />
            {profileOptions.map((option, index) => (
                (!option.requiresDesigner || isDesigner) && (
                    <ProfileListItem
                        key={index}
                        name={option.name}
                        icon={option.icon}
                        onPress={() => handlePress(option.name)}
                    />
                )
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
