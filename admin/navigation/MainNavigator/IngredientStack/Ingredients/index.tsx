import React from 'react'
import { Text, View } from 'react-native'

import IngredientsList from './components/IngredientList'
// import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Ingredient dashboard</Text>
    </View>
  )
}

export default function Ingredients() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <IngredientsList style={{ marginBottom: 16 }} />
      {/* <ProductCreator /> */}
    </View>
  )
}
