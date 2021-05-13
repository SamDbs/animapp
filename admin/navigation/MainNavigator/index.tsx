import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import * as React from 'react'

import useColorScheme from '@hooks/useColorScheme'

import { MainTabParamList } from '../../types'
import Colors from '../../constants/Colors'
import Menu from './components/Menu'
import Products from './Products'
import Ingredients from './Ingredients'


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
        <BottomTab.Screen name="Ingredients" component={Ingredients} />
      </BottomTab.Navigator>
    </View>
  )
}
