import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import { AuthStackParamList } from '../../types'
import Login from './Login'

const Stack = createStackNavigator<AuthStackParamList>()

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}
