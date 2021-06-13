import useCachedResources from '@hooks/useCachedResources'
import Uploady from '@rpldy/uploady'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigator from './navigation'

export default function App() {
  const isLoadingComplete = useCachedResources()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <Uploady>
        <SafeAreaProvider>
          <RootNavigator />
          <StatusBar />
        </SafeAreaProvider>
      </Uploady>
    )
  }
}
