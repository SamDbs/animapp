import React from 'react'
import { Text, TextInput, View } from 'react-native'

export default function FieldWithLabel({
  label,
  onChangeValue,
  value,
}: {
  label: string
  onChangeValue: any
  value: string
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      <TextInput
        style={{ padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 3 }}
        onChangeText={onChangeValue}
        defaultValue={value}
      />
    </View>
  )
}
