import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { HelpStackParamList } from '../../../../types'
import { Card, SafeAreaPage, Text } from '../../../components/Themed'

type Props = StackScreenProps<HelpStackParamList, 'HelpHome'>

export default function HelpHome({ navigation: { navigate } }: Props): JSX.Element {
  return (
    <SafeAreaPage noContext>
      <View style={style.marginTop} />
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

const style = StyleSheet.create({ card: { padding: 20 }, marginTop: { height: 5 } })
