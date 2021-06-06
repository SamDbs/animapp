import React, { useState } from 'react'
import { View } from 'react-native'

import { PageHeader } from '@components/Themed'

import ProductsList from './components/ProductsList'
import ProductCreator from './components/ProductCreator'

export default function Products() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Products dashboard</PageHeader>
      <ProductsList style={{ marginBottom: 16 }} />
      <ProductCreator />
    </View>
  )
}
