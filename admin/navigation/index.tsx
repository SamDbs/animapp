import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'

import useAuthStore from '@hooks/stores/auth'
import useColorScheme from '@hooks/useColorScheme'

import { RootStackParamList } from '../types'
import AuthStackNavigator from './AuthStackNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import MainNavigator from './MainNavigator'
import NotFoundScreen from './NotFoundScreen'

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  const colorScheme = useColorScheme()
  const [jwt, loginUsingAsyncStorage] = useAuthStore((state) => [
    state.jwt,
    state.loginUsingAsyncStorage,
  ])
  const [isInitialized, setInitialized] = useState(false)

  useEffect(() => {
    async function init() {
      await loginUsingAsyncStorage()
      setInitialized(true)
    }
    init()
  }, [])

  const isConnected = !!jwt
  if (!isInitialized) return null

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isConnected && <Stack.Screen name="Auth" component={AuthStackNavigator} />}
        {isConnected && (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
