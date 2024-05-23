import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { Octicons, FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import Fonts from '@/src/constants/Fonts';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

function TabBarIcon(props) {
  const { library, ...iconProps } = props;
  if (library === 'Octicons') {
    return <Octicons size={24} style={{ marginBottom: -3 }} {...iconProps} />;
  } else if (library === 'FontAwesome') {
    return <FontAwesome size={24} style={{ marginBottom: -3 }} {...iconProps} />;
  } else if (library === 'MaterialIcons') {
    return <MaterialIcons size={24} style={{ marginBottom: -3 }} {...iconProps} />;
  } else if (library === 'Feather') {
    return <Feather size={24} style={{ marginBottom: -3 }} {...iconProps} />;
  }
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontFamily: 'Roboto-Regular',
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarActiveTintColor: Colors.blueIris,
        tabBarInactiveTintColor: Colors.grey,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.lightestGrey,
          borderTopWidth: 1,
          paddingTop: 10,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'MODCO',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 20,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} library='Octicons' />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Zoeken',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} library='Octicons' />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Verkopen',
          tabBarIcon: ({ color }) => <TabBarIcon name="add-circle" color={color} library='MaterialIcons' />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorieten',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} library='Octicons' />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profiel',
          headerTitle: 'Mijn Profiel',
          headerTitleStyle: {
            fontFamily: 'PPMonumentExtended-Regular',
            fontSize: 14,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} library='Feather' />,
        }}
      />
    </Tabs>
  );
}
