import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import FaqCreator from './components/FaqCreator'
import FaqList from './components/FaqList'

export default function Faqs() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Questions &amp; Answers</PageHeader>
      <FaqList style={{ marginBottom: 16 }} />
      <FaqCreator />
    </View>
  )
}
