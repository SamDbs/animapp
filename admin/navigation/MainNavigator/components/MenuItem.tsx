import * as React from 'react'
import { Pressable, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

type Props = { title: string; to: string }

export default function MenuItem({ to, title }: Props) {
  const navigation = useNavigation()
  return (
    <Pressable style={{ cursor: 'pointer', padding: 16 }} onPress={() => navigation.navigate(to)}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
    </Pressable>
  )
}
