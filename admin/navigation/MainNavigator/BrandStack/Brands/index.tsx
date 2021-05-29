import React from 'react'
import { Text, View } from 'react-native'

import BrandList from './components/BrandList'
// import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Brand dashboard</Text>
    </View>
  )
}

export default function Brands() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <BrandList style={{ marginBottom: 16 }} />
      {/* <ProductCreator /> */}
    </View>
  )
}
