import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ScrollView } from 'react-native'

import { DevStackParamList } from '../../../../types'
import IngredientsAnalyzer from './components/IngredientAnalyzer'

export default function Dev(props: StackScreenProps<DevStackParamList, 'Dev'>) {
  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Dev tools</PageHeader>
      <IngredientsAnalyzer />
    </ScrollView>
  )
}
