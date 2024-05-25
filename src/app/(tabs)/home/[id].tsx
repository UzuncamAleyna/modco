import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router'

const Item = () => {
  const { id } = useLocalSearchParams()
  return (
    <View>
      <Stack.Screen options={{ title: 'Detail: ' + id }}/>

      <Text>item id: {id}</Text>
    </View>
  )
}

export default Item;