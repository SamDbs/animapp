import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { MainTabParamList, RootStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { SafeAreaPage, Text, Title, ContentView, Card } from '../../components/Themed'
import ProductCard from '../Search/components/ProductCard'

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

  const isEmpty = historyProductsIds.length === 0

  return (
    <SafeAreaPage>
      <Title>History</Title>
      {isEmpty ? (
        <View style={style.emptyContainer}>
          <Card style={style.empty}>
            <Text>You don&apos;t have any product history yet</Text>
          </Card>
        </View>
      ) : (
        <ScrollView style={style.scrollView}>
          {historyProductsIds.map((id) => (
            <Product
              key={id}
              productId={id}
              navigate={
                navigation.navigate as StackNavigationProp<
                  RootStackParamList,
                  'Product'
                >['navigate']
              }
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  scrollView: { flexGrow: 1 },
  empty: { padding: 20, borderRadius: 200 },
  emptyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
})
