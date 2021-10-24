import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import useAuthStore from '@hooks/stores/auth'
import useCachedResources from '@hooks/useCachedResources'
import Uploady from '@rpldy/uploady'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo } from 'react'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { Theme } from 'react-native-paper/lib/typescript/types'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useColorScheme from './hooks/useColorScheme'
import RootNavigator from './navigation'

const themes: Record<ReturnType<typeof useColorScheme>, Theme> = {
  light: { ...DefaultTheme },
  dark: { ...DefaultTheme, dark: true },
}

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const jwt = useAuthStore((state) => state.jwt)

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri: `${Constants.manifest?.extra?.API_URL}/graphql`,
        cache: new InMemoryCache({ addTypename: false }),
        headers: { Authorization: jwt },
      }),
    [jwt],
  )

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <ApolloProvider client={apolloClient}>
        <PaperProvider theme={themes[colorScheme]}>
          <Uploady>
            <SafeAreaProvider>
              <RootNavigator />
              <StatusBar />
            </SafeAreaProvider>
          </Uploady>
        </PaperProvider>
      </ApolloProvider>
    )
  }
}
