import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ProductStackParamList } from '../../../types'
import Product from './Product'
import Products from './Products'

const Stack = createStackNavigator<ProductStackParamList>()

export default function ProductStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="Products"
      screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Product" component={Product} />
    </Stack.Navigator>
  )
}
