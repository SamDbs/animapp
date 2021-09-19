import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useContactsStore, { ContactStoreState, Contact } from '@hooks/stores/contact'
import useSearchableList from '@hooks/useSearchableList'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable } from 'react-native-paper'

export default function ContactList({ style }: { style?: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: contacts,
    noResult,
    pagination,
    searchDebounced,
  } = useSearchableList<ContactStoreState, Contact>(
    useContactsStore,
    (state) => state.searchContacts,
    (ids) => (state) => ids.map((id) => state.contacts[id]),
  )

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Contact list</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingVertical: 0,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 8 }}>Search</Text>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              height: 30,
              paddingHorizontal: 8,
            }}
            onChangeText={searchDebounced}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Message</DataTable.Title>
          </DataTable.Header>
          {contacts.filter(Boolean).map((contact, i: number) => {
            return (
              <DataTable.Row key={contact.id}>
                <DataTable.Cell>{contact.name}</DataTable.Cell>
                <DataTable.Cell>{contact.message}</DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
          {!isLoading && noResult && <NoResult />}
        </DataTable>
      </View>
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
