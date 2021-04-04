import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React from 'react'

import { ProductsHistoryStackParamList } from '../../../types'

import Product from './Product'
import ProductsHistory from './ProductHistory'

const Stack = createStackNavigator<ProductsHistoryStackParamList>()

export default function ScanProductStackNavigator(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={ProductsHistory} name="ProductsHistory" />
        <Stack.Screen component={Product} name="Product" />
      </Stack.Navigator>
    </SafeAreaProvider>
  )
}
