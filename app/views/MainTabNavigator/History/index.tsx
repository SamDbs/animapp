import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { MainTabParamList, RootStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { SafeAreaPage, Text, Title } from '../../components/Themed'
import ProductCard from '../Search/components/ProductCard'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

function Product(props: {
  productId: number
  navigate?: StackNavigationProp<RootStackParamList, 'Product'>['navigate']
}) {
  const { data: product, error } = useSWR(`/products/${props.productId}`)

  if (error) return null
  if (!product) return <Text>Loading</Text>

  console.log('product', product)

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
    <SafeAreaPage>
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
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  scrollView: { flexGrow: 1 },
})
