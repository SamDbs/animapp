import { PageHeader } from '@components/Themed'
import React from 'react'
import { View } from 'react-native'

import ContactDeletedList from './components/ContactDeletedList'
import ContactList from './components/ContactsList'

export default function Contacts() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PageHeader>Contacts</PageHeader>
      <ContactList style={{ marginBottom: 16 }} />
      <ContactDeletedList />
    </View>
  )
}
