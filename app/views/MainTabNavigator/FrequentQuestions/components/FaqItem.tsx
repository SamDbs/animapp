import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export type FaqItemType = { id: number; question: string; answer: string }

type Props = { item: FaqItemType }

export default function FaqItem(props: Props): JSX.Element {
  const [expanded, setExpanded] = useState(false)
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
        <Text>{props.item.question}</Text>
      </TouchableWithoutFeedback>
      {expanded && <Text>{props.item.answer}</Text>}
    </View>
  )
}
