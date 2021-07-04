import { ScrollView } from 'react-native-gesture-handler'
import { StackScreenProps } from '@react-navigation/stack'
import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'
import React, { createContext, useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import ProductHistoryContext from '../hooks/ProductHistoryContext'
import { RootStackParamList } from '../types'

import { Card, ContentView, SafeAreaPage, Text, Title } from './components/Themed'

const CARD_SIZE = 80

type Props = StackScreenProps<RootStackParamList, 'Product'>

type AnalyticalConstituent = {
  id: number
  quantity: string
  name: string
  description: string
}

type Ingredient = {
  id: number
  quantity: string
  name: string
  description: string
  review: string
}

const IMG_MARGIN = 20

const IngredientModalContext = createContext<{ ingredientId: number | null; open: any }>({
  ingredientId: null,
  open: (id: number) => null,
})

function ProductHeader({ product }: { product: any }) {
  const dimensions = useWindowDimensions()
  const { width } = dimensions
  return (
    <Card style={{ flexDirection: 'row' }}>
      <View
        style={{
          height: width * 0.4,
          width: width * 0.4,
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: product.image }}
          style={{
            height: width * 0.4 - IMG_MARGIN,
            width: width * 0.4 - IMG_MARGIN,
            margin: IMG_MARGIN / 2,
            borderRadius: 5,
            overflow: 'hidden',
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={{ width: width * 0.6 - 20, padding: 10 }}>
        <Text style={{ fontSize: 24 }}>{product.name}</Text>
        <Text style={{ fontSize: 12 }}>{product.type}</Text>
        <Text style={{ marginTop: 20 }}>{product.description}</Text>
      </View>
    </Card>
  )
}

function Ingredients({
  route: {
    params: {
      ingredients: { ingredients },
    },
  },
}: {
  route: { params: { ingredients: { ingredients: Ingredient[]; relations: any[] } } }
  navigation: any
}) {
  return (
    <ContentView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {ingredients.map((ingredient: any, i: number) => (
          <React.Fragment key={ingredient.id}>
            <Ingredient ingredient={ingredient} />
          </React.Fragment>
        ))}
      </ScrollView>
    </ContentView>
  )
}

function Ingredient({ ingredient }: { ingredient: any }) {
  const modal = useContext(IngredientModalContext)

  return (
    <TouchableOpacity onPress={() => modal.open(ingredient.id)}>
      <View key={ingredient.id} style={{ padding: 10, flex: 1 }}>
        <View>
          <Text>{ingredient.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function Row(props: JSX.Element['props']) {
  return (
    <View
      style={{
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

function AnalyticalConstituents({
  route: {
    params: { ACs, productId },
  },
}: {
  route: {
    params: {
      ACs: { analyticalConstituents: AnalyticalConstituent[]; relations: any[] }
      productId: number
    }
  }
}) {
  if (ACs.analyticalConstituents.length === 0)
    return <ContentView style={{ paddingHorizontal: 10, flex: 1 }} />

  return (
    <ContentView style={{ paddingHorizontal: 10, flex: 1 }}>
      <Row>
        <Text style={{ fontWeight: 'bold' }}>Element</Text>
        <Text style={{ fontWeight: 'bold' }}>Nutrition value</Text>
      </Row>
      {ACs.analyticalConstituents.map((AC, i) => {
        const foundRelation = ACs.relations.find(
          (rel) => rel.constituentId === AC.id && rel.productId == productId,
        )
        return (
          <Row key={AC.id} last={i === ACs.analyticalConstituents.length - 1}>
            <Text>{AC.name}</Text>
            <Text>{foundRelation && foundRelation.quantity ? foundRelation.quantity : '-'}</Text>
          </Row>
        )
      })}
    </ContentView>
  )
}

const DetailsTabNavigator = createMaterialTopTabNavigator()

function ProductDetails({
  ACs,
  ingredients,
  productId,
}: {
  ACs: { analyticalConstituents: AnalyticalConstituent[]; relations: any[] }
  ingredients: { ingredients: Ingredient[]; relations: any[] }
  productId: number
}) {
  return (
    <Card style={{ marginTop: 0, flex: 1 }}>
      <DetailsTabNavigator.Navigator initialRouteName="Ingredients" style={{ borderRadius: 10 }}>
        <DetailsTabNavigator.Screen
          component={Ingredients}
          name="Ingredients"
          initialParams={{ ingredients }}
        />
        <DetailsTabNavigator.Screen
          component={AnalyticalConstituents}
          name="Constituents"
          initialParams={{ ACs, productId }}
        />
      </DetailsTabNavigator.Navigator>
    </Card>
  )
}

function ModalIngredient({ ingredient }: { ingredient: any }) {
  const modal = useContext(IngredientModalContext)

  return (
    <TouchableOpacity
      style={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        elevation: 1,
      }}
      onPress={() => modal.open(null)}>
      <TouchableWithoutFeedback>
        <Card
          style={{
            elevation: 10,
            padding: 10,
            margin: 20,
          }}>
          <Title>{ingredient.name}</Title>
          <Text>{ingredient.description}</Text>
          <Text>{ingredient.review}</Text>
          <Image
            source={{ uri: ingredient.image }}
            style={{
              height: CARD_SIZE,
              width: CARD_SIZE,
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              overflow: 'hidden',
            }}
          />
        </Card>
      </TouchableWithoutFeedback>
    </TouchableOpacity>
  )
}

function ProductView(props: Props): JSX.Element {
  const { data: product } = useSWR(`/products/${props.route.params.productId}`)
  const { data: ingredients } = useSWR(`/products/${props.route.params.productId}/ingredients`)
  const { data: ACs } = useSWR(`/products/${props.route.params.productId}/analytical-constituents`)
  const { viewProduct } = useContext(ProductHistoryContext)
  const modal = useContext(IngredientModalContext)

  useEffect(() => {
    if (product && product.id) {
      props.navigation.setOptions({ title: product.name })
      viewProduct(product.id)
    }
  }, [product, viewProduct, props.navigation])

  if (!product || !ingredients || !ACs) return <Text>Loading...</Text>

  return (
    <SafeAreaPage noContext>
      <ProductHeader product={product} />
      <ProductDetails
        productId={props.route.params.productId}
        ACs={ACs}
        ingredients={ingredients}
      />
      {modal.ingredientId && (
        <ModalIngredient
          ingredient={ingredients.find(({ id }: any) => id === modal.ingredientId)}
        />
      )}
    </SafeAreaPage>
  )
}

export default function Product(props: Props): JSX.Element {
  const [ingredientId, open] = useState<null | number>(null)

  return (
    <IngredientModalContext.Provider value={{ ingredientId, open }}>
      <ProductView {...props} />
    </IngredientModalContext.Provider>
  )
}
