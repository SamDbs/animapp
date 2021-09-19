import React from 'react'
import { Text, View } from 'react-native'

export default function NoResult() {
  return (
    <View style={{ padding: 8 }}>
      <Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: 'red' }}>No result.</Text>
    </View>
  )
}
