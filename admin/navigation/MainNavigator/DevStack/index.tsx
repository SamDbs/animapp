import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { DevStackParamList } from '../../../types'
import Dev from './Dev'

const Stack = createStackNavigator<DevStackParamList>()

export default function DevStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dev"
      screenOptions={{ animationEnabled: true, headerShown: false }}>
      <Stack.Screen name="Dev" component={Dev} />
    </Stack.Navigator>
  )
}
