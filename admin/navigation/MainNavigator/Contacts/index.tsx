import React from 'react'
import { Text, View } from 'react-native'

import ContactList from './components/ContactsList'
// import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Contacts dashboard</Text>
    </View>
  )
}

export default function Contacts() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <ContactList style={{ marginBottom: 16 }} />
      {/* <ProductCreator /> */}
    </View>
  )
}
