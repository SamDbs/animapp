import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SWRConfig, SWRConfiguration } from 'swr'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

const swrConfig: SWRConfiguration = {
  fetcher: async (resource, init) => {
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

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <SWRConfig value={swrConfig}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SWRConfig>
      </SafeAreaProvider>
    )
  }
}
