import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { IngredientStackParamList } from '../../../types'
import Ingredient from './Ingredient'
import Ingredients from './Ingredients'

const Stack = createStackNavigator<IngredientStackParamList>()

export default function IngredientStack() {
  return (
    <Stack.Navigator
      initialRouteName="Ingredients"
      screenOptions={{ animationEnabled: true, headerShown: false }}>
      <Stack.Screen name="Ingredients" component={Ingredients} />
      <Stack.Screen name="Ingredient" component={Ingredient} />
    </Stack.Navigator>
  )
}
