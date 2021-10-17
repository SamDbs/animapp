import { useQuery, gql } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable } from 'react-native-paper'

type Contact = {
  id: string
  name: string
  message: string
}

const LIMIT = 5

const GET_CONTACTS = gql`
  query GetContacts($offset: Int, $limit: Int = ${LIMIT}, $searchTerms: String = "") {
    contacts(limit: $limit, offset: $offset, searchTerms: $searchTerms) {
      id
      name
      message
    }
    contactsCount(searchTerms: $searchTerms)
  }
`

const initialPagination = {
  page: 0,
  offset: 0,
}

export default function ContactList({ style }: { style?: View['props']['style'] }) {
  const [pagination, setPagination] = useState(initialPagination)

  const { data, loading, refetch } = useQuery<{
    contacts: Contact[]
    contactsCount: number
  }>(GET_CONTACTS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

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
            onChangeText={search}
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
          {data?.contacts.map((contact) => {
            return (
              <DataTable.Row key={contact.id}>
                <DataTable.Cell>{contact.name}</DataTable.Cell>
                <DataTable.Cell>{contact.message}</DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {loading && <ActivityIndicator style={{ margin: 8 }} />}
          {!loading && data?.contacts.length === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination((x) => ({ ...x, page: i, offset: LIMIT * i }))}
        pagination={{
          count: data?.contactsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
