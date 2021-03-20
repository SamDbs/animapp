import { RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackNavigationProp } from '@react-navigation/stack'
import { Text } from 'react-native'
import React from 'react'
import useSWR from 'swr'

import { SearchStackParamList } from '../types'

type ProductScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'Product'>
type ProfileScreenRouteProp = RouteProp<SearchStackParamList, 'Product'>

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
