import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import ContactList from './components/ContactsList'

export default function Contacts() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Contacts</PageHeader>
      <ContactList style={{ marginBottom: 16 }} />
    </View>
  )
}
