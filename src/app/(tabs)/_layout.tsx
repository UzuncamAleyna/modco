import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { Octicons, FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
type OcticonProps = {
  name: React.ComponentProps<typeof Octicons>['name'];
  color: string;
};

type FontAwesomeProps = {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
};

type MaterialIconsProps = {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
};

type FeatherProps = {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
};


function TabBarIcon(props: OcticonProps & FontAwesomeProps & MaterialIconsProps & FeatherProps & { library: 'Octicons' | 'FontAwesome' | 'MaterialIcons' | 'Feather'}) {
  const { library, ...iconProps } = props;
  if (library === 'Octicons') {
    return <Octicons size={24} style={{ marginBottom: -3 }} {...iconProps as OcticonProps} />;
  } else if (library === 'FontAwesome') {
    return <FontAwesome size={24} style={{ marginBottom: -3 }} {...iconProps as FontAwesomeProps} />;
  } else if (library === 'MaterialIcons') {
    return <MaterialIcons size={24} style={{ marginBottom: -3 }} {...iconProps as MaterialIconsProps} />;
  } else if (library === 'Feather') {
    return <Feather size={24} style={{ marginBottom: -3 }} {...iconProps as FeatherProps} />;
  }
}


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
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
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
          title: 'Zoek',
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
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} library='Feather' />,
        }}
      />
    </Tabs>
  );
}
