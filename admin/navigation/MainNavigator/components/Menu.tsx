import * as React from 'react'
import { Text, View } from 'react-native'

import MenuItem from './MenuItem'

export default function Menu() {
  return (
    <View style={{ backgroundColor: '#999', width: 200 }}>
      <MenuItem title="Products" />
      <MenuItem title="Ingredients" />
      <MenuItem title="Languages" />
      <MenuItem title="FAQ" />
      <MenuItem title="Contact" />
    </View>
  )
}
