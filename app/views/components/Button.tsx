import { Pressable, View } from 'react-native'
import { useState } from 'react'

import { Text } from './Themed'

export function Button({
  color = '#65A68E',
  disabled = false,
  onPress,
  style = {},
  title,
}: {
  color?: string
  disabled?: boolean
  onPress: any
  style?: View['props']['style']
  title: string
}): JSX.Element {
  const [status, set] = useState('chill')

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => set('pressed')}
      onPressOut={() => set('chill')}
      onPress={onPress}
      style={{
        borderRadius: 10,
        backgroundColor: disabled ? '#444' : color,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        opacity: status === 'chill' ? 1 : 0.5,
        ...style,
      }}>
      <Text darkColor="#fff" lightColor="#fff" style={{ fontWeight: 'bold' }}>
        {title}
      </Text>
    </Pressable>
  )
}
