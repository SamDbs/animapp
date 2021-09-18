import { useNavigation } from '@react-navigation/core'
import * as React from 'react'
import { Text, View } from 'react-native'

import MenuItem from './MenuItem'

export default function Menu() {
  const n = useNavigation()

  const [, s] = React.useState(0)

  React.useEffect(() => {
    const unsubscribe = n.addListener('state', () => {
      s(Date.now())
    })
    return unsubscribe
  }, [])

  return (
    <View style={{ backgroundColor: '#999', width: 200 }}>
      <View>
        <Text style={{ fontSize: 18, padding: 16 }}>Animapp admin</Text>
      </View>
      <MenuItem title="Brands" to="/brands" />
      <MenuItem title="Products" to="/products" />
      <MenuItem title="Ingredients" to="/ingredients" />
      <MenuItem title="Analytical Constituents" to="/constituents" />
      <MenuItem title="Languages" to="/languages" />
      <MenuItem title="FAQ" to="/faq" />
      <MenuItem title="Contacts" to="/contacts" />
      <MenuItem title="Dev tools" to="/dev" />
    </View>
  )
}
