import useCachedResources from '@hooks/useCachedResources'
import Uploady from '@rpldy/uploady'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
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

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <PaperProvider theme={themes[colorScheme]}>
        <Uploady>
          <SafeAreaProvider>
            <RootNavigator />
            <StatusBar />
          </SafeAreaProvider>
        </Uploady>
      </PaperProvider>
    )
  }
}
