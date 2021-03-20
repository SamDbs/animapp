import { RouteProp } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { StackNavigationProp } from '@react-navigation/stack'
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import useSWR from 'swr'

import { SearchStackParamList } from '../types'

type ProductScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'Product'>
type ProfileScreenRouteProp = RouteProp<SearchStackParamList, 'Product'>

type Props = {
  navigation: ProductScreenNavigationProp
  route: ProfileScreenRouteProp
}

function ProductHeader({ product }: { product: any }) {
  return (
    <View style={{ backgroundColor: '#fff', flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 24 }}>{product.name}</Text>
      <Text style={{ fontSize: 12 }}>{product.type}</Text>
      <Text style={{ marginTop: 20 }}>{product.description}</Text>
    </View>
  )
}

function Separator() {
  return <View style={{ borderColor: 'silver', borderWidth: StyleSheet.hairlineWidth }} />
}

function Ingredients({ ingredients }: { ingredients: any[] }) {
  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
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

export default function Product(props: Props): JSX.Element {
  const { data: product } = useSWR(`/products/${props.route.params.productId}`)
  const { data: ingredients } = useSWR(`/products/${props.route.params.productId}/ingredients`)

  if (!product || !ingredients) return <Text>Loading...</Text>

  return (
    <SafeAreaView style={style.page}>
      <ProductHeader product={product} />
      <Ingredients ingredients={ingredients} />
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  page: { flex: 1 },
})
