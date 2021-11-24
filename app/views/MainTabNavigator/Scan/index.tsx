import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Text } from '../../components/Themed'
import { MainTabParamList } from '../../../types'

type Props = BottomTabScreenProps<MainTabParamList, 'Scan'>

export default function ScanProduct({ navigation }: Props): JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [code, setCode] = useState('')
  const [camera, setCamera] = useState(true)

  useEffect(() => {
    async function checkCameraPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkCameraPermission()

    function emptyCodeOnFocus() {
      setCode('')
      setCamera(true)
    }

    function disableCamera() {
      setCamera(false)
    }

    const unsubscribe1 = navigation.addListener('focus', emptyCodeOnFocus)
    const unsubscribe2 = navigation.addListener('blur', disableCamera)

    return () => {
      unsubscribe1()
      unsubscribe2()
    }
  }, [navigation])

  const { data, error } = useSWR(code ? `/scan/${code}` : null)

  function onBarCodeScanned(barcode: BarCodeEvent) {
    console.log('scanned', barcode)
    setCode(barcode.data)
  }

  useEffect(() => {
    if (code && data && !error) {
      setCode('')
      navigation.navigate('Product' as any, { productId: data.productId })
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
      {camera && !code && <Camera onBarCodeScanned={onBarCodeScanned} style={style.viewFinder} />}
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
