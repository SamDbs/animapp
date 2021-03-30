import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React from 'react'

import { ScanProductStackParamList } from '../../../types'

import Product from './Product'
import ScanProduct from './ScanProduct'

const Stack = createStackNavigator<ScanProductStackParamList>()

export default function ScanProductStackNavigator(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={ScanProduct} name="ScanProduct" />
        <Stack.Screen component={Product} name="Product" />
      </Stack.Navigator>
    </SafeAreaProvider>
  )
}
