import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { ContentView, Text } from '../../components/Themed'
import {
  Constituent,
  Constituents,
  Ingredient,
  Ingredients,
} from '../../../hooks/queries/GetProduct'
import Colors from '../../../constants/Colors'
import useColorScheme from '../../../hooks/useColorScheme'
import IngredientModalContext from './context'

const DetailsTabNavigator = createMaterialTopTabNavigator()

function IngredientView({ quantity, ingredient }: { quantity: string; ingredient: Ingredient }) {
  const modal = useContext(IngredientModalContext)

  return (
    <TouchableOpacity onPress={() => modal.open(ingredient.id)}>
      <View style={{ padding: 10, flex: 1 }}>
        <Row>
          <Text>{ingredient.name}</Text>
          <Text>{quantity ?? '-'}</Text>
        </Row>
      </View>
    </TouchableOpacity>
  )
}

function ConstituentView({
  constituent,
  quantity,
}: {
  constituent: Constituent
  quantity: string
}) {
  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Row>
        <Text>{constituent.name}</Text>
        <Text>{quantity ?? '-'}</Text>
      </Row>
    </View>
  )
}

function IngredientsView({
  route: {
    params: { ingredients },
  },
}: {
  route: { params: { ingredients: Ingredients } }
}) {
  return (
    <ContentView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {ingredients?.map((ingredient) => (
          <IngredientView
            key={ingredient.ingredient.id}
            ingredient={ingredient.ingredient}
            quantity={ingredient.quantity}
          />
        ))}
      </ScrollView>
    </ContentView>
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
    params: { constituents },
  },
}: {
  route: { params: { constituents: Constituents } }
}) {
  return (
    <ContentView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {constituents?.map((constituent) => (
          <ConstituentView
            key={constituent.constituent.id}
            constituent={constituent.constituent}
            quantity={constituent.quantity}
          />
        ))}
      </ScrollView>
    </ContentView>
  )
}

export default function ProductDetails({
  constituents,
  ingredients,
  productId,
}: {
  constituents: Constituents
  ingredients: Ingredients
  productId: string
}) {
  const colorSheme = useColorScheme()
  const { accent, tint } = Colors[colorSheme]

  return (
    <View style={{ marginTop: 0, flex: 1 }}>
      <DetailsTabNavigator.Navigator
        initialRouteName="Ingredients"
        style={{ borderRadius: 10 }}
        screenOptions={{
          tabBarStyle: { backgroundColor: accent },
          tabBarIndicatorStyle: { backgroundColor: tint },
          tabBarPressColor: tint,
        }}>
        <DetailsTabNavigator.Screen
          component={IngredientsView}
          name="Ingredients"
          initialParams={{ ingredients }}
        />

        <DetailsTabNavigator.Screen
          component={AnalyticalConstituents}
          name="Constituents"
          initialParams={{ constituents }}
        />
      </DetailsTabNavigator.Navigator>
    </View>
  )
}
