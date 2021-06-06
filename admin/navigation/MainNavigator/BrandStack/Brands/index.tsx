import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import BrandCreator from './components/BrandCreator'
import BrandList from './components/BrandList'

export default function Brands() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Brands dashboard</PageHeader>
      <BrandList style={{ marginBottom: 16 }} />
      <BrandCreator />
    </View>
  )
}
