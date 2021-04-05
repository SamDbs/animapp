import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { MainTabParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { Text } from '../../components/Themed'

type Props = StackScreenProps<MainTabParamList, 'History'>

function ProductHistory({ id, navigation }: { id: number; navigation: Props['navigation'] }) {
  const { data: product, error } = useSWR(`/products/${id}`)

  if (error) return null
  if (!product) return <Text>Loading</Text>

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('SearchStackNavigator', {
          screen: 'SearchProduct',
          params: { productId: id },
        })
      }>
      <Text>
        {product.id} - {product.name}
      </Text>
    </TouchableWithoutFeedback>
  )
}

export default function History({ navigation }: Props): JSX.Element {
  const { historyProductsIds } = useContext(ProductHistoryContext)

  return (
    <SafeAreaView style={style.page}>
      <Text>History</Text>
      <ScrollView style={style.scrollView}>
        {historyProductsIds.map((id) => (
          <ProductHistory key={id} id={id} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
  scrollView: { flexGrow: 1 },
})
