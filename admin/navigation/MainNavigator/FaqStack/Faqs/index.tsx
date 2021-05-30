import React from 'react'
import { View } from 'react-native'

import FaqList from './components/FaqList'
import FaqCreator from './components/FaqCreator'
import { PageHeader } from '@components/Themed'

export default function Faqs() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Questions &amp; Answers</PageHeader>
      <FaqList style={{ marginBottom: 16 }} />
      <FaqCreator />
    </View>
  )
}
