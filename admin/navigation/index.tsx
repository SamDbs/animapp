import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ColorSchemeName } from 'react-native'

import NotFoundScreen from '../screens/NotFoundScreen'
import { RootStackParamList } from '../types'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStackNavigator from './AuthStackNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import { useSelector } from '../hooks/redux'

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const isConnected = useSelector((state) => state.auth.jwt)
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isConnected && <Stack.Screen name="Auth" component={AuthStackNavigator} />}
        <Stack.Screen name="Root" component={BottomTabNavigator} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
