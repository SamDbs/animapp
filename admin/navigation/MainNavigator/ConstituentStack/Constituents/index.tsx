import React from 'react'
import { Text, View } from 'react-native'

import ConstituentList from './components/ConstituentList'
import ConstituentCreator from './components/ConstituentCreator'


function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Analytical Constituent dashboard</Text>
    </View>
  )
}

export default function Constituents() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <ConstituentList style={{ marginBottom: 16 }} />
      <ConstituentCreator />

    </View>
  )
}
