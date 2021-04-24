import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { MainTabParamList, RootStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { Text } from '../../components/Themed'
import ProductCard from '../Search/components/ProductCard'
import { Title } from '../FrequentQuestions'
type Props = BottomTabScreenProps<MainTabParamList, 'History'>

function Product(props: {
  productId: number
  navigate?: StackNavigationProp<RootStackParamList, 'Product'>['navigate']
}) {
  const { data: product, error } = useSWR(`/products/${props.productId}`)

  if (error) return null
  if (!product) return <Text>Loading</Text>

  return (
    <ProductCard
      product={product}
      onPress={() => {
        if (props.navigate) props.navigate('Product', { productId: props.productId })
      }}
    />
  )
}

export default function History({ navigation }: Props): JSX.Element {
  const { historyProductsIds } = useContext(ProductHistoryContext)

  return (
    <SafeAreaView style={style.page}>
      <Title>History</Title>
      <ScrollView style={style.scrollView}>
        {historyProductsIds.map((id) => (
          <Product
            key={id}
            productId={id}
            navigate={
              navigation.navigate as StackNavigationProp<RootStackParamList, 'Product'>['navigate']
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
  scrollView: { flexGrow: 1 },
})
