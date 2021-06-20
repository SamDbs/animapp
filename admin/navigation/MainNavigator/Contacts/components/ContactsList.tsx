import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useContactsStore, { ContactStoreState, Contact } from '@hooks/stores/contact'
import useSearchableList from '@hooks/useSearchableList'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

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
        {noResult && (
          <View style={{ padding: 8 }}>
            <Text>No result.</Text>
          </View>
        )}
        {contacts.filter(Boolean).map((contact: any, i: number) => {
          return (
            <View
              key={contact.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === contacts.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
              }}>
              <Text>{contact.name}</Text>
              <Text>{contact.message}</Text>
            </View>
          )
        })}
      </View>
      <ActivityIndicator style={{ margin: 8 }} color={isLoading ? undefined : 'transparent'} />
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
