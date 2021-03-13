import { Ionicons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'
import ProductsHistory from '../screens/ProductsHistory'
import ScanProduct from '../screens/ScanProduct'
import SearchProductsIngredients from '../screens/SeachProductsIngredients'
import TabOneScreen from '../screens/TabOneScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

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
          tabBarIcon: ({ color }) => <TabBarIcon name="scan" color={color} />,
          title: 'Scan',
        }}
      />
      <BottomTab.Screen
        name="SearchProductsIngredients"
        component={SearchProductsIngredients}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          title: 'Search',
        }}
      />
      <BottomTab.Screen
        name="ProductsHistory"
        component={ProductsHistory}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="time" color={color} />,
          title: 'History',
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>()

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: 'Tab One Title' }}
      />
    </TabOneStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </TabTwoStack.Navigator>
  )
}
