import React from 'react'
import { LayoutAnimation, Platform, StyleSheet, Text, UIManager, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

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
    <View style={style.component}>
      <TouchableWithoutFeedback
        onPressIn={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          props.toggle()
        }}>
        <Title>{props.item.question}</Title>
      </TouchableWithoutFeedback>
      {props.isOpen && (
        <View>
          <Text>{props.item.answer}</Text>
        </View>
      )}
    </View>
  )
}

const style = StyleSheet.create({
  component: { padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
})
