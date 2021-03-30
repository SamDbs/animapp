import React from 'react'
import { Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

type Props = { item: { id: number; question: string; answer: string } }

export default function Question(props: Props): JSX.Element {
  return (
    <View>
      <View>
        <TouchableWithoutFeedback>
          <Text>{props.item.question}</Text>
        </TouchableWithoutFeedback>
        <Text>{props.item.answer}</Text>
      </View>
    </View>
  )
}
