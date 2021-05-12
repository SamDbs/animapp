import React from 'react'
import { Text, TextInput, View } from 'react-native'

const statusColor = {
  default: '#ccc',
  loading: 'orange',
  saved: 'green',
}

type Props = {
  label: string
  onChangeValue: (text: string) => void
  status?: keyof typeof statusColor
  value: string
}

export default function FieldWithLabel({ label, onChangeValue, status = 'default', value }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      <TextInput
        style={{
          padding: 8,
          borderColor: statusColor[status],
          borderWidth: 1,
          borderRadius: 3,
        }}
        onChangeText={onChangeValue}
        value={value}
      />
    </View>
  )
}
