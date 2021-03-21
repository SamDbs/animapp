import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as React from 'react'

import Colors from '../constants/Colors'
import SearchStackNavigator from '../navigation/SearchStackNavigator'
import useColorScheme from '../hooks/useColorScheme'
import ProductsHistory from '../screens/ProductsHistory'
import ScanProduct from '../screens/ScanProduct'
import { BottomTabParamList } from '../types'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

function createTabBarIcon(icon: React.ComponentProps<typeof Ionicons>['name']) {
  return function TabBarIcon({ color }: { color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} name={icon} color={color} />
  }
}

export default function MainTabNavigator(): JSX.Element {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="ScanProduct"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="ScanProduct"
        component={ScanProduct}
        options={{
          tabBarIcon: createTabBarIcon('scan'),
          title: 'Scan',
        }}
      />
      <BottomTab.Screen
        name="SearchStackNavigator"
        component={SearchStackNavigator}
        options={{
          tabBarIcon: createTabBarIcon('search'),
          title: 'Search',
        }}
      />
      <BottomTab.Screen
        name="ProductsHistory"
        component={ProductsHistory}
        options={{
          tabBarIcon: createTabBarIcon('time'),
          title: 'History',
        }}
      />
    </BottomTab.Navigator>
  )
}
