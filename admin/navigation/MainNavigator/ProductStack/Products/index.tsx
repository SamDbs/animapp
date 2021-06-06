import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import ProductCreator from './components/ProductCreator'
import ProductsList from './components/ProductsList'

export default function Products() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Products dashboard</PageHeader>
      <ProductsList style={{ marginBottom: 16 }} />
      <ProductCreator />
    </View>
  )
}
