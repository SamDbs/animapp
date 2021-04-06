import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'

import { MainTabParamList } from '../../types'
import Colors from '../../constants/Colors'
import useColorScheme from '../../hooks/useColorScheme'

import FrequentQuestions from './FrequentQuestions'
import History from './History'
import Scan from './Scan'
import Search from './Search'

const BottomTab = createBottomTabNavigator<MainTabParamList>()

function createTabBarIcon(icon: React.ComponentProps<typeof Ionicons>['name']) {
  return function TabBarIcon({ color }: { color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} name={icon} color={color} />
  }
}

export default function MainTabNavigator(): JSX.Element {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName="Scan"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarIcon: createTabBarIcon('scan'),
          title: 'Scan',
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: createTabBarIcon('search'),
          title: 'Search',
        }}
      />
      <BottomTab.Screen
        name="History"
        component={History}
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
