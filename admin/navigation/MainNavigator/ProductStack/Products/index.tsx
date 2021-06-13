import { PageHeader } from '@components/Themed'
import React from 'react'
import { ScrollView } from 'react-native'

import ProductCreator from './components/ProductCreator'
import ProductsList from './components/ProductsList'

export default function Products() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <PageHeader>Products dashboard</PageHeader>
      <ProductCreator style={{ marginBottom: 16 }} />
      <ProductsList />
    </ScrollView>
  )
}
