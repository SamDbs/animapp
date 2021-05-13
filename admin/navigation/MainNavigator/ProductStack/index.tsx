import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ProductStackParamList } from '../../../types'
import Products from './Products'
import Product from './Product'

const Stack = createStackNavigator<ProductStackParamList>()

export default function ProductStack() {
  return (
    <Stack.Navigator initialRouteName="Products" screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Product" component={Product} />
    </Stack.Navigator>
  )
}
