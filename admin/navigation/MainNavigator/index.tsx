import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { Text, View } from 'react-native'

import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'
import { MainTabParamList } from '../../types'
import Menu from './components/Menu'
import Products from './Products'

const BottomTab = createBottomTabNavigator<MainTabParamList>()

export default function TabNavigator() {
  const colorScheme = useColorScheme()

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Menu />
      <BottomTab.Navigator
        initialRouteName="Products"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
        tabBar={() => null}>
        <BottomTab.Screen name="Products" component={Products} />
      </BottomTab.Navigator>
    </View>
  )
}
