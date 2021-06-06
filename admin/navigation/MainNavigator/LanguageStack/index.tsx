import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { LanguageStackParamList } from '../../../types'
import Language from './Language'
import Languages from './Languages'

const Stack = createStackNavigator<LanguageStackParamList>()

export default function IngredientStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName="Languages"
      screenOptions={{ animationEnabled: true }}>
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="Language" component={Language} />
    </Stack.Navigator>
  )
}
