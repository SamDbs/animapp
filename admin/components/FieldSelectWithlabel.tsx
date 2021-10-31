import { Picker } from '@react-native-picker/picker'
import enumStrings from '@utils/enum-strings'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

const statusColor = {
  default: '#ccc',
  loading: 'orange',
  saved: 'green',
}

type Props = {
  label: string
  onChangeValue: (text: keyof typeof enumStrings[Props['translationKey']]) => void
  options: (keyof typeof enumStrings[Props['translationKey']])[]
  status?: keyof typeof statusColor
  translationKey: keyof typeof enumStrings
  value: keyof typeof enumStrings[Props['translationKey']]
}

export default function FieldSelectWithLabel({
  label,
  onChangeValue,
  options,
  status = 'default',
  translationKey,
  value,
}: Props) {
  const [selected, setSelected] = useState(value)
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      <Picker
        onValueChange={(x) => {
          setSelected(x)
          onChangeValue(x)
        }}
        selectedValue={selected}
        style={{
          borderColor: statusColor[status],
          borderRadius: 3,
          borderWidth: 1,
          padding: 8,
        }}>
        {options.map((option) => (
          <Picker.Item key={option} label={enumStrings[translationKey][option]} value={option} />
        ))}
      </Picker>
    </View>
  )
}
