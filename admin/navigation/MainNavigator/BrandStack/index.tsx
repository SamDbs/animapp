import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { BrandStackParamList } from '../../../types'
import Brand from './Brand'
import Brands from './Brands'

const Stack = createStackNavigator<BrandStackParamList>()

export default function FaqStack() {
  return (
    <Stack.Navigator
      initialRouteName="Brands"
      screenOptions={{ animationEnabled: true, headerShown: false }}>
      <Stack.Screen name="Brands" component={Brands} />
      <Stack.Screen name="Brand" component={Brand} />
    </Stack.Navigator>
  )
}
