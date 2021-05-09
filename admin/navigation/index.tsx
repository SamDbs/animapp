import { ColorSchemeName } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'

import { useAuthStore } from '@hooks/stores'

import { RootStackParamList } from '../types'
import AuthStackNavigator from './AuthStackNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import MainNavigator from './MainNavigator'
import NotFoundScreen from './NotFoundScreen'

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { getItem } = useAsyncStorage('jwt')
  const jwt = useAuthStore((state) => state.jwt)
  const setJwt = useAuthStore((state) => state.setJwt)

  useEffect(() => {
    async function initFromLocalStorage() {
      const localStorageJwt = await getItem()
      if (localStorageJwt) setJwt(localStorageJwt)
    }
    initFromLocalStorage()
  }, [])

  const isConnected = !!jwt

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
