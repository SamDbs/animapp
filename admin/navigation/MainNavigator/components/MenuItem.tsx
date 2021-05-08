import * as React from 'react'
import { Text, View } from 'react-native'

type Props = { title: string }

export default function MenuItem({ title }: Props) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </View>
  )
}
