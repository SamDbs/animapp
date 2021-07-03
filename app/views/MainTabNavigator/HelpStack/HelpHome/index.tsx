import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'

import { HelpStackParamList } from '../../../../types'
import { Card, SafeAreaPage, Text, Title } from '../../../components/Themed'

type Props = StackScreenProps<HelpStackParamList, 'HelpHome'>

export default function HelpHome({ navigation: { navigate } }: Props): JSX.Element {
  return (
    <SafeAreaPage>
      <Title>Help</Title>
      <TouchableWithoutFeedback onPress={() => navigate('FrequentQuestions')}>
        <Card style={style.card}>
          <Text>Frequent questions</Text>
        </Card>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigate('Contact')}>
        <Card style={style.card}>
          <Text>Contact us</Text>
        </Card>
      </TouchableWithoutFeedback>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({ card: { padding: 20 } })
