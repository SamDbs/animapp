import { ScrollView } from 'react-native-gesture-handler'
import { StackScreenProps } from '@react-navigation/stack'
import { Image, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import useSWR from 'swr'

import { RootStackParamList } from '../types'
import ProductHistoryContext from '../hooks/ProductHistoryContext'
import globalStyle from './components/style'

type Props = StackScreenProps<RootStackParamList, 'Product'>

type AnalyticalConstituent = {
  id: number
  quantity: string
  name: string
  description: string
}

const IMG_MARGIN = 20

function ProductHeader({ product }: { product: any }) {
  const dimensions = useWindowDimensions()
  const { width } = dimensions
  return (
    <View
      style={{
        ...globalStyle.card,
        flexDirection: 'row',
        height: width * 0.4,
      }}>
      <View
        style={{
          height: width * 0.4,
          width: width * 0.4,
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: product.photo,
          }}
          style={{
            height: width * 0.4 - IMG_MARGIN,
            width: width * 0.4 - IMG_MARGIN,
            margin: IMG_MARGIN / 2,
            borderRadius: 5,
            overflow: 'hidden',
            resizeMode: 'contain',
            backgroundColor: 'red',
          }}
        />
      </View>
      <View style={{ width: width * 0.6 - 20, padding: 10 }}>
        <Text style={{ fontSize: 24 }}>{product.name}</Text>
        <Text style={{ fontSize: 12 }}>{product.type}</Text>
        <Text style={{ marginTop: 20 }}>{product.description}</Text>
      </View>
    </View>
  )
}

function Separator() {
  return <View style={{ borderColor: 'silver', borderWidth: StyleSheet.hairlineWidth }} />
}

function Ingredients({ ingredients }: { ingredients: any[] }) {
  return (
    <View style={{ ...globalStyle.card, marginTop: 0, backgroundColor: '#fff', flex: 1 }}>
      <Text style={{ fontSize: 24, paddingLeft: 10 }}>Ingredients</Text>
      <ScrollView style={{ flex: 1 }}>
        {ingredients.map((ingredient: any, i: number) => (
          <React.Fragment key={ingredient.id}>
            <Ingredient ingredient={ingredient} />
            {i !== ingredients.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  )
}

function Ingredient({ ingredient }: { ingredient: any }) {
  return (
    <View key={ingredient.id} style={{ padding: 10, flex: 1 }}>
      <View>
        <Text>{ingredient.name}</Text>
      </View>
      <View>
        <Text>{ingredient.review}</Text>
      </View>
      <View>
        <Text>{ingredient.description}</Text>
      </View>
    </View>
  )
}

function Table(props: JSX.Element['props']) {
  return (
    <View style={{ paddingHorizontal: 10, backgroundColor: '#fff' }}>
      <View style={{ borderWidth: StyleSheet.hairlineWidth, borderRadius: 10 }}>
        {props.children}
      </View>
    </View>
  )
}

function Row(props: JSX.Element['props']) {
  return (
    <View
      style={{
        borderBottomWidth: props.last ? 0 : StyleSheet.hairlineWidth,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
      }}>
      {props.children}
    </View>
  )
}

function AnalyticalConstituants({ ACs }: { ACs: AnalyticalConstituent[] }) {
  if (ACs.length === 0) return null
  return (
    <Table>
      <Row>
        <Text style={{ fontWeight: 'bold' }}>Element</Text>
        <Text style={{ fontWeight: 'bold' }}>Nutrition value</Text>
      </Row>
      {ACs.map((AC, i) => (
        <Row key={AC.id} last={i === ACs.length - 1}>
          <Text>{AC.name}</Text>
          <Text>{AC.quantity ? AC.quantity : '-'}%</Text>
        </Row>
      ))}
    </Table>
  )
}

export default function Product(props: Props): JSX.Element {
  const { data: product } = useSWR(`/products/${props.route.params.productId}`)
  const { data: ingredients } = useSWR(`/products/${props.route.params.productId}/ingredients`)
  const { data: AC } = useSWR(`/products/${props.route.params.productId}/analyticalConstituents`)
  const { viewProduct } = useContext(ProductHistoryContext)

  useEffect(() => {
    if (product && product.id) viewProduct(product.id)
  }, [product, viewProduct])

  if (!product || !ingredients || !AC) return <Text>Loading...</Text>

  return (
    <SafeAreaView style={style.page}>
      <ProductHeader product={product} />
      <AnalyticalConstituants ACs={AC} />
      <Ingredients ingredients={ingredients} />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
})
