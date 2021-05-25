import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

import useContactsStore from '@hooks/stores/contact'
import Card from '@components/Card'
import { debounce } from 'lodash/fp'

export default function ContactList({ isLoading, style }: any) {
  const [ids, setContactIds] = useState<string[]>([])
  const [registerIds, unregisterIds, getContacts, searchContacts] = useContactsStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getContacts,
    state.searchContacts,
  ])

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const contacts = useContactsStore(
    useCallback((state) => ids.map((id) => state.contacts[id]), [ids]),
  )

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      const { ids } = await searchContacts(text)
      setContactIds(ids)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      const { ids } = await getContacts()
      setContactIds(ids)
    }
    fn()
  }, [])

  const noResult = !contacts.length

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
        {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
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
    </Card>
  )
}
