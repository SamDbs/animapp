import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { BrandStackParamList } from '../../../types'
import Brand from './Brand'
import Brands from './Brands'

const Stack = createStackNavigator<BrandStackParamList>()

export default function FaqStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="Brands"
      screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Brands" component={Brands} />
      <Stack.Screen name="Brand" component={Brand} />
    </Stack.Navigator>
  )
}
