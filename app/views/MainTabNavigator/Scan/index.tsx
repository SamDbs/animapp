import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Text } from '../../components/Themed'
import { SearchStackParamList } from '../../../types'

export default function ScanProduct({
  navigation,
}: StackScreenProps<SearchStackParamList, 'SearchProduct'>): JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    async function checkCameraPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkCameraPermission()

    function emptyCodeOnFocus() {
      setCode('')
    }

    const unsubscribe = navigation.addListener('focus', emptyCodeOnFocus)
    return unsubscribe
  }, [navigation])

  const { data, error } = useSWR(code ? `/scan/${code}` : null)

  function onBarCodeScanned(barcode: BarCodeEvent) {
    console.log('barcode', barcode)
    setCode(barcode.data)
  }

  useEffect(() => {
    if (code && data && !error) {
      setCode('')
      navigation.push('SearchProduct', { productId: data.productId })
    } else if (error) {
      alert('Bar code not working.')
      setCode('')
    }
  }, [code, data, error, navigation])

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
      {!code && <BarCodeScanner onBarCodeScanned={onBarCodeScanned} style={style.viewFinder} />}
      {!!code && <ActivityIndicator size={40} color="#ccc" />}
    </View>
  )
}

const style = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFinder: StyleSheet.absoluteFillObject,
})
