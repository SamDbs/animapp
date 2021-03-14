import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SWRConfig } from 'swr'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'

export default function App(): JSX.Element | null {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(`${process.env.API_URL}${resource}`, init).then((res) => res.json()),
          }}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SWRConfig>
      </SafeAreaProvider>
    )
  }
}
