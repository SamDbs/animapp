import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { HelpStackParamList } from '../../../../types'
import { SafeAreaPage, Text } from '../../../components/Themed'

type Props = StackScreenProps<HelpStackParamList, 'AboutHome'>

export default function HelpHome({ navigation: { navigate } }: Props): JSX.Element {
  return (
    <SafeAreaPage noContext>
      <View style={style.marginTop} />
      <TouchableWithoutFeedback onPress={() => navigate('FrequentQuestions')}>
        <View
          style={[
            style.card,
            { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#999' },
          ]}>
          <Text>Questions fréquentes</Text>
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={() => navigate('Contact')}>
        <View style={style.card}>
          <Text>Nous contacter</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaPage>
  )
}

const style = StyleSheet.create({
  card: { marginHorizontal: 20, paddingVertical: 20 },
  marginTop: { height: 5 },
})
