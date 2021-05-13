import React from 'react'
import { Text, View } from 'react-native'

import ProductsList from './components/ProductsList'
import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Products dashboard</Text>
    </View>
  )
}

export default function Products() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <ProductsList style={{ marginBottom: 16 }} />
      <ProductCreator />
    </View>
  )
}
