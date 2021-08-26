import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import useSWR from 'swr'

import { MainTabParamList, RootStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { Card, PageHeader, SafeAreaPage, Text } from '../../components/Themed'
import ProductListItem from '../Search/components/ProductListItem'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

function Product(props: {
  isFirst: boolean
  productId: number
  navigate?: StackNavigationProp<RootStackParamList, 'Product'>['navigate']
}) {
  const { data: product, error } = useSWR(`/products/${props.productId}`)

  if (error) return null
  if (!product) return <Text>Loading</Text>

  return (
    <ProductListItem
      product={product}
      onPress={() => {
        if (props.navigate) props.navigate('Product', { productId: props.productId })
      }}
      isFirst={props.isFirst}
    />
  )
}

export default function History({ navigation }: Props): JSX.Element {
  const { historyProductsIds } = useContext(ProductHistoryContext)

  const isEmpty = historyProductsIds.length === 0

  return (
    <SafeAreaPage>
      <PageHeader>History</PageHeader>

      {isEmpty ? (
        <View style={style.emptyContainer}>
          <Card style={style.empty}>
            <Text>You don&apos;t have any product history yet</Text>
          </Card>
        </View>
      ) : (
        <ScrollView style={style.scrollView}>
          <View style={style.marginTop} />
          {historyProductsIds.map((id, i) => (
            <Product
              key={id}
              productId={id}
              isFirst={i === 0}
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
  marginTop: { marginTop: 30 },
  scrollView: { flexGrow: 1 },
  empty: { padding: 20, borderRadius: 200 },
  emptyContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
})
