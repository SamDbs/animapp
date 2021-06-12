import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import ConstituentCreator from './components/ConstituentCreator'
import ConstituentList from './components/ConstituentList'

export default function Constituents() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Analytical Constituent dashboard</PageHeader>
      <ConstituentList style={{ marginBottom: 16 }} />
      <ConstituentCreator />
    </View>
  )
}
