import { Text } from '@components/Themed'
import React from 'react'
import { ScrollView, View } from 'react-native'

import IngredientCreator from './components/IngredientCreator'
import IngredientDeletedList from './components/IngredientDeletedList'
import IngredientList from './components/IngredientList'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Ingredient dashboard</Text>
    </View>
  )
}

export default function Ingredients() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Header />
      <IngredientList style={{ marginBottom: 16 }} />
      <IngredientCreator style={{ marginBottom: 16 }} />
      <IngredientDeletedList />
    </ScrollView>
  )
}
