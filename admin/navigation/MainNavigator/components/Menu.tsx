import { useLinkBuilder, useNavigationState } from '@react-navigation/native'
import * as React from 'react'
import { Text, View } from 'react-native'

import MenuItem from './MenuItem'

export default function Menu() {
  return (
    <View style={{ backgroundColor: '#999', width: 200 }}>
      <MenuItem title="Brands" to="/brands" />
      <MenuItem title="Products" to="/products" />
      <MenuItem title="Ingredients" to="/ingredients" />
      <MenuItem title="Analytical Constituents" to="/constituents" />
      <MenuItem title="Languages" to="/languages" />
      <MenuItem title="FAQ" to="/faq" />
      <MenuItem title="Contacts" to="/contacts" />
    </View>
  )
}
