import React from 'react'
import { View } from 'react-native'

import { Text } from '@components/Themed'

import IngredientsList from './components/IngredientList'
import IngredientCreator from './components/IngredientCreator'

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
      <IngredientCreator />
    </View>
  )
}
