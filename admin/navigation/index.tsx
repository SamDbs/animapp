import { ColorSchemeName } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'

import { login } from '../features/auth/actions'
import { RootStackParamList } from '../types'
import { useDispatch, useSelector } from '../hooks/redux'
import AuthStackNavigator from './AuthStackNavigator'
import LinkingConfiguration from './LinkingConfiguration'
import MainNavigator from './MainNavigator'
import NotFoundScreen from '../screens/NotFoundScreen'

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { getItem, setItem } = useAsyncStorage('jwt')
  const dispatch = useDispatch()
  const jwt = useSelector((state) => state.auth.jwt)
  const [isInitialized, setInitialized] = useState(false) 

  useEffect(() => {
    async function initFromLocalStorage() {
      const localStorageJwt = await getItem()
      if (localStorageJwt) dispatch({ type: login.fulfilled.type, payload: localStorageJwt })
      setInitialized(true)
    }
    initFromLocalStorage()

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
