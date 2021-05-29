import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { LanguageStackParamList } from '../../../types'
import Language from './Language'
import Languages from './Languages'

const Stack = createStackNavigator<LanguageStackParamList>()

export default function IngredientStack() {
  return (
    <Stack.Navigator initialRouteName="Languages" screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="Language" component={Language} />
    </Stack.Navigator>
  )
}
