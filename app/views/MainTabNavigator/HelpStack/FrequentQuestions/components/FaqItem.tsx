import React from 'react'
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { Card, Text } from '../../../../components/Themed'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export type FaqItemType = { id: number; question: string; answer: string }

type Props = { item: FaqItemType; isOpen: boolean; toggle: any }

function Title(props: JSX.Element['props']) {
  return <Text style={style.title}>{props.children}</Text>
}
export default function FaqItem(props: Props): JSX.Element {
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        props.toggle()
      }}>
      <Card style={style.component}>
        <Title>{props.item.question}</Title>
        {props.isOpen && (
          <View style={style.answer}>
            <Text>{props.item.answer}</Text>
          </View>
        )}
      </Card>
    </TouchableWithoutFeedback>
  )
}

const style = StyleSheet.create({
  component: { padding: 10 },
  title: { fontSize: 16, fontWeight: '500' },
  answer: { marginTop: 10 },
})
