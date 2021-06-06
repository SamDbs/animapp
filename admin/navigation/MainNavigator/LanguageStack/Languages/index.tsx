import React from 'react'
import { View } from 'react-native'

import { PageHeader } from '@components/Themed'

import LanguageCreator from './components/LanguageCreator'
import LanguageList from './components/LanguageList'

export default function Languages() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Languages dashboard</PageHeader>
      <LanguageList style={{ marginBottom: 16 }} />
      <LanguageCreator />
    </View>
  )
}
