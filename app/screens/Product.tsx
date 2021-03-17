import { RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp } from '@react-navigation/stack'
import { Text } from 'react-native'
import React from 'react'
import useSWR from 'swr'

import { RootStackParamList } from '../types'

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Product'>
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Product'>

type Props = {
  navigation: ProductScreenNavigationProp
  route: ProfileScreenRouteProp
}

export default function Product(props: Props): JSX.Element {
  const { data } = useSWR(`/products/${props.route.params.productId}`)

  if (!data) return <Text>Loading...</Text>

  return (
    <SafeAreaView>
      <Text>{data.name}</Text>
    </SafeAreaView>
  )
}
