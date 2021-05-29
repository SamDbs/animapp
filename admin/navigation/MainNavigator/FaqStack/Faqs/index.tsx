import React from 'react'
import { Text, View } from 'react-native'

import FaqList from './components/FaqList'
// import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Faq dashboard</Text>
    </View>
  )
}

export default function Faqs() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <FaqList style={{ marginBottom: 16 }} />
      {/* <ProductCreator /> */}
    </View>
  )
}
