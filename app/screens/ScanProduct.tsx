import { BarCodeScanner } from 'expo-barcode-scanner'
import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { Text } from '../components/Themed'

export default function ScanProduct(): JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkCameraPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkCameraPermission()
  }, [])

  if (hasPermission === null) {
    return (
      <View style={style.screen}>
        <Text>Waiting for permission...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={style.screen}>
        <Text>Waiting for permission...</Text>
      </View>
    )
  }

  return (
    <View style={style.screen}>
      <BarCodeScanner
        onBarCodeScanned={(scan) => console.log('scanned:', scan)}
        style={style.viewFinder}
      />
    </View>
  )
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
  viewFinder: {
    flex: 1,
    justifyContent: 'flex-end',
  },
})
