import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

import { GET_CONTACTS } from './ContactsList'

const LIMIT = 5

type Contact = {
  id: string
  name: string
  message: string
  createdAt: Date
}

export const GET_DELETE_CONTACTS = gql`
  query GetDeletedContacts($offset: Int, $limit: Int, $searchTerms: String = "") {
    contacts(
      limit: $limit
      offset: $offset
      searchTerms: $searchTerms
      filters: { deleted: true }
    ) {
      id
      name
      email
      message
      createdAt
    }
    contactsCount(searchTerms: $searchTerms, filters: { deleted: true })
  }
`
const initialPagination = {
  page: 0,
  offset: 0,
}

const RESTORE_CONTACT = gql`
  mutation RestoreContact($id: String!) {
    restoreContact(id: $id) {
      id
    }
  }
`

export default function ContactDeletedList({ style }: { style?: View['props']['style'] }) {
  const [restoreContact] = useMutation(RESTORE_CONTACT, {
    refetchQueries: [GET_CONTACTS, GET_DELETE_CONTACTS],
  })
  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<{
    contacts: Contact[]
    contactsCount: number
  }>(GET_DELETE_CONTACTS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Deleted contacts</Text>
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
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title>Message</DataTable.Title>
            <DataTable.Title numeric>Date</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>

          {data?.contacts.filter(Boolean).map((contact: any, i: number) => {
            return (
              <DataTable.Row key={contact.id}>
                <DataTable.Cell>{contact.name}</DataTable.Cell>
                <DataTable.Cell>{contact.email}</DataTable.Cell>
                <DataTable.Cell>{contact.message}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {new Date(contact.createdAt).toLocaleString()}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete-restore"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        await restoreContact({ variables: { id: contact.id } })
                      } catch (error: any) {
                        alert(error.response.data.message)
                      }
                    }}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {loading && <ActivityIndicator style={{ margin: 8 }} />}
          {!loading && data?.contacts.length === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination({ page: i, offset: LIMIT * i })}
        pagination={{
          count: data?.contactsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
