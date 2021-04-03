import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { ProductsHistoryStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { Text } from '../../components/Themed'

function ProductHistory({ id }: { id: number }) {
  const { data: product, error } = useSWR(`/products/${id}`)

  if (error) return null
  if (!product) return <Text>Loading</Text>

  return (
    <View>
      <Text>
        {product.id} - {product.name}
      </Text>
    </View>
  )
}

export default function ProductsHistory({
  navigation,
}: StackScreenProps<ProductsHistoryStackParamList, 'ProductsHistory'>): JSX.Element {
  const { historyProductsIds } = useContext(ProductHistoryContext)

  return (
    <SafeAreaView style={style.page}>
      <Text>History</Text>
      <ScrollView style={style.scrollView}>
        {historyProductsIds.map((id) => (
          <ProductHistory key={id} id={id} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
  scrollView: { flexGrow: 1 },
})
