import React, { useState } from 'react'
import { Text, View } from 'react-native'

import LanguageCreator from './components/LanguageCreator'
import LanguageList from './components/LanguageList'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Language dashboard</Text>
    </View>
  )
}

export default function Languages() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <LanguageList style={{ marginBottom: 16 }} />
      <LanguageCreator />
    </View>
  )
}
