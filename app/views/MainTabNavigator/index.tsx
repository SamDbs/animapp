import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'

import { BottomTabParamList } from '../../types'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'

import FrequentQuestions from './FrequentQuestions'
import ProductsHistory from './ProductsHistory'
import ScanProductStackNavigator from './ScanProductStackNavigator'
import SearchStackNavigator from './SearchStackNavigator'

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
      initialRouteName="ScanProductStackNavigator"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="ScanProductStackNavigator"
        component={ScanProductStackNavigator}
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
      <BottomTab.Screen
        name="FrequentQuestions"
        component={FrequentQuestions}
        options={{
          tabBarIcon: createTabBarIcon('help'),
          title: 'Help',
        }}
      />
    </BottomTab.Navigator>
  )
}
