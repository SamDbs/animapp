import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { useContext } from 'react'

import { MainTabParamList, RootStackParamList } from '../../../types'
import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import { Card, PageHeader, SafeAreaPage, Text } from '../../components/Themed'
import ProductListItem from '../Search/components/ProductListItem'
import useGetProductFromHistory from '../../../hooks/queries/GetProductFromHistory'

type Props = BottomTabScreenProps<MainTabParamList, 'History'>

function Product(props: {
  isFirst: boolean
  productId: string
  navigate?: StackNavigationProp<RootStackParamList, 'Product'>['navigate']
}) {
  const { data, loading } = useGetProductFromHistory(props.productId)

  if (loading || !data?.product) return <ActivityIndicator size={40} color="#ccc" />

  return (
    <ProductListItem
      product={data.product}
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
