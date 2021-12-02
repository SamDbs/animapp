import { debounce } from 'lodash/fp'
import React, { useCallback } from 'react'
import { Text, TextInput, View } from 'react-native'

const statusColor = {
  default: '#ccc',
  loading: 'orange',
  saved: 'green',
}

type Props = {
  delay?: number
  label: string
  onChangeValue: (text: string) => void
  status?: keyof typeof statusColor
  value: string
}

export default function FieldWithLabel({
  delay = 0,
  label,
  onChangeValue,
  status = 'default',
  value,
}: Props) {
  const onChangeText = useCallback(delay ? debounce(delay, onChangeValue) : onChangeValue, [
    onChangeValue,
    delay,
  ])

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
        onChangeText={onChangeText}
        defaultValue={value}
      />
    </View>
  )
}
