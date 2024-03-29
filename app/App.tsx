import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SWRConfig, SWRConfiguration } from 'swr'

import Colors from './constants/Colors'
import ProductHistoryContext from './hooks/ProductHistoryContext'
import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import useProductHistoryContextValue from './hooks/useProductsHistory'
import Navigation from './views'

// http://10.0.2.2:8080 for android to localhost

const swrConfig: SWRConfiguration = {
  fetcher: async (resource, init) => {
    // const request = await fetch(`http://10.0.2.2:8080${resource}`, init)
    const request = await fetch(`${process.env.API_URL}${resource}`, init)
    if (!request.ok) {
      const error = new Error('Request failed.')
      //@ts-expect-error data doesn't exist
      error.data = await request.json()
      //@ts-expect-error status doesn't exist
      error.status = request.status
      throw error
    } else {
      const result = await request.json()
      return result
    }
  },
}

export default function App(): JSX.Element | null {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const historyContextValue = useProductHistoryContextValue()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider style={{ backgroundColor: Colors[colorScheme].background }}>
        <SWRConfig value={swrConfig}>
          <ProductHistoryContext.Provider value={historyContextValue}>
            <Navigation colorScheme={colorScheme} />
          </ProductHistoryContext.Provider>
          <StatusBar />
        </SWRConfig>
      </SafeAreaProvider>
    )
  }
}
