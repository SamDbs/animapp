import React from 'react'
import { Text, View } from 'react-native'

import BrandList from './components/BrandList'
import BrandCreator from './components/BrandCreator'
import { PageHeader } from '@components/Themed'

export default function Brands() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Brands dashboard</PageHeader>
      <BrandList style={{ marginBottom: 16 }} />
      <BrandCreator />
    </View>
  )
}
