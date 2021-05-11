import React from 'react'
import { View } from 'react-native'

export default function Card(props: View['props']) {
  const styleObject: object = props.style ? props.style : {}

  return (
    <View
      {...props}
      style={{
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'rgba(4,9,20,0.10)',
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
        padding: 16,
        ...styleObject,
      }}
    />
  )
}
