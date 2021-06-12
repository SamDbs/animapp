import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { ConstituentStackParamList } from '../../../types'
import Constituent from './Constituent'
import Constituents from './Constituents'

const Stack = createStackNavigator<ConstituentStackParamList>()

export default function IngredientStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="Constituents"
      screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Constituents" component={Constituents} />
      <Stack.Screen name="Constituent" component={Constituent} />
    </Stack.Navigator>
  )
}
