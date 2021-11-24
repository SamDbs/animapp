import {
  DarkTheme,
  DefaultTheme,
  LinkingOptions,
  NavigationContainer,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'
import { makeUrl } from 'expo-linking'

import { RootStackParamList } from '../types'

import MainTabNavigator from './MainTabNavigator'
import NotFoundScreen from './NotFoundScreen'
import Product from './Product'

const linkingOptions: LinkingOptions<RootStackParamList> = {
  prefixes: [makeUrl('/')],
  config: {
    initialRouteName: 'MainTabNavigator',
    screens: {
      MainTabNavigator: {
        screens: {
          ScanProductStackNavigator: {
            screens: {
              Scan: 'scan',
              ScanProduct: 'scan-product',
            },
          },
          SearchStackNavigator: {
            screens: {
              Search: 'search',
              SearchProduct: 'search-product',
            },
          },
          HistoryStackNavigator: {
            screens: {
              History: 'history',
              HistoryProduct: 'history-product',
            },
          },
          About: {
            screens: {
              AboutHome: 'about',
              FrequentQuestions: 'help-faq',
              Contact: 'help-contact',
            },
          },
        },
      },
      Product: 'product',
      NotFound: '*',
    },
  },
}

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }): JSX.Element {
  return (
    <NavigationContainer<RootStackParamList>
      linking={linkingOptions}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  )
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>()

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabNavigator">
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{ headerShown: true, headerBackTitle: '' }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  )
}
