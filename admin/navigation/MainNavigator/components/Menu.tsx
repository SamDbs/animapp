import { useLinkBuilder, useNavigationState } from '@react-navigation/native'
import * as React from 'react'
import { Text, View } from 'react-native'

import MenuItem from './MenuItem'

export default function Menu() {
  return (
    <View style={{ backgroundColor: '#999', width: 200 }}>
      <MenuItem title="Brands" to="BrandStack" />
      <MenuItem title="Products" to="ProductStack" />
      <MenuItem title="Ingredients" to="IngredientStack" />
      <MenuItem title="Analytical Constituents" to="ConstituentStack" />
      <MenuItem title="Languages" to="LanguageStack" />
      <MenuItem title="FAQ" to="FaqStack" />
      <MenuItem title="Contacts" to="Contacts" />

    </View>
  )
}
