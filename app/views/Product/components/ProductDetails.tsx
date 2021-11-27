import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { ContentView, Text } from '../../components/Themed'
import { Ingredients } from '../../../hooks/queries/GetProduct'
import Colors from '../../../constants/Colors'
import useColorScheme from '../../../hooks/useColorScheme'
import IngredientModalContext from './context'

const DetailsTabNavigator = createMaterialTopTabNavigator()

function IngredientView({ ingredient }: { ingredient: any }) {
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

function IngredientsView({
  route: {
    params: { ingredients },
  },
}: {
  route: { params: { ingredients: Ingredients } }
  navigation: any
}) {
  return (
    <ContentView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {ingredients?.map((ingredient) => (
          <IngredientView key={ingredient.ingredient.id} ingredient={ingredient.ingredient} />
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
    params: { ACs, productId },
  },
}: {
  route: {
    params: {
      ACs: { analyticalConstituents: any[]; relations: any[] }
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

export default function ProductDetails({
  ACs,
  ingredients,
  productId,
}: {
  ACs: { analyticalConstituents: any[]; relations: any[] }
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
        {/*
        <DetailsTabNavigator.Screen
          component={AnalyticalConstituents}
          name="Constituents"
          initialParams={{ ACs, productId }}
        />
        */}
      </DetailsTabNavigator.Navigator>
    </View>
  )
}
