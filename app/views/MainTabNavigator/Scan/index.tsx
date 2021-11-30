import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { useEffect, useState } from 'react'

import { Text } from '../../components/Themed'
import { MainTabParamList } from '../../../types'
import useGetProductByBarCode from '../../../hooks/queries/GetProductByBarCode'

type Props = BottomTabScreenProps<MainTabParamList, 'Scan'>

export default function ScanProduct({ navigation }: Props): JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [camera, setCamera] = useState(true)

  useEffect(() => {
    async function checkCameraPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkCameraPermission()

    function emptyCodeOnFocus() {
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

  const [fetch, { loading }] = useGetProductByBarCode()

  async function onBarCodeScanned(barcode: BarCodeEvent) {
    const result = await fetch({ variables: { barCode: barcode.data } })
    const productId = result.data?.product.id
    if (productId) navigation.navigate('Product' as any, { productId: productId })
    else alert('Product not found.')
  }

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
      {camera && <Camera onBarCodeScanned={onBarCodeScanned} style={style.viewFinder} />}
      {loading && <ActivityIndicator size={40} color="#ccc" />}
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
