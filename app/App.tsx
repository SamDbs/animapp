import React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useMemo } from 'react'
import Constants from 'expo-constants'

import Colors from './constants/Colors'
import ProductHistoryContext from './hooks/ProductHistoryContext'
import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import useProductHistoryContextValue from './hooks/useProductsHistory'
import Navigation from './views'

export default function App(): JSX.Element | null {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const historyContextValue = useProductHistoryContextValue()

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri: `${Constants.manifest?.extra?.API_URL}/graphql`,
        cache: new InMemoryCache(),
        // connectToDevTools: true,
      }),
    [],
  )

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider style={{ backgroundColor: Colors[colorScheme].background }}>
        <ApolloProvider client={apolloClient}>
          <ProductHistoryContext.Provider value={historyContextValue}>
            <Navigation colorScheme={colorScheme} />
          </ProductHistoryContext.Provider>
          <StatusBar />
        </ApolloProvider>
      </SafeAreaProvider>
    )
  }
}
