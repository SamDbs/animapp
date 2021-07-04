import { PageHeader } from '@components/Themed'
import React from 'react'
import { ScrollView } from 'react-native'

import BrandCreator from './components/BrandCreator'
import BrandDeletedList from './components/BrandDeletedList'
import BrandList from './components/BrandList'

export default function Brands() {
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <PageHeader>Brands dashboard</PageHeader>
      <BrandList style={{ marginBottom: 16 }} />
      <BrandCreator style={{ marginBottom: 16 }} />
      <BrandDeletedList />
    </ScrollView>
  )
}
