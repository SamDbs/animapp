import { useQuery } from '@apollo/client'
import Card from '@components/Card'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import gql from 'graphql-tag'
import React, { Fragment } from 'react'
import { ActivityIndicator, ScrollView, Text } from 'react-native'
import { DataTable } from 'react-native-paper'

import { ContactStackParamList } from '../../../../types'
import { GET_CONTACTS } from '../Contacts/components/ContactsList'

type Contact = { id: string; name: string; email: string; message: string; createdAt: string }

export const GET_CONTACT = gql`
  query GetContact($id: String!) {
    contact(id: $id) {
      id
      name
      email
      message
      createdAt
    }
  }
`

const refreshQueries = [GET_CONTACTS]

export default function ContactComponent(
  props: StackScreenProps<ContactStackParamList, 'Contact'>,
) {
  const { data, loading } = useQuery<{ contact: Contact }>(GET_CONTACT, {
    variables: { id: props.route.params.id },
  })
  const { data: contacts } =
    useQuery<{
      contacts: Contact[]
      contactsCount: number
    }>(GET_CONTACTS)

  const contact = data?.contact
  const allContacts = contacts?.contacts
  const contactWithMessages = allContacts?.filter((c) => c.email === contact?.email)
  console.log(contactWithMessages)
  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Contact Info</PageHeader>
      <Card>
        {loading && <ActivityIndicator />}
        {contact && (
          <>
            <DataTable>
              <DataTable.Row>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Cell>{contact.name}</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Title>Email</DataTable.Title>
                <DataTable.Cell>{contact.email}</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
            <Card>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Message</DataTable.Title>
                  <DataTable.Title>Created at</DataTable.Title>
                </DataTable.Header>
                {contactWithMessages?.map((c) => {
                  return (
                    <DataTable.Row key={contact.id}>
                      <DataTable.Cell>
                        <Text style={{ whiteSpace: 'pre-line' }}>{c.message}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell>{new Date(c.createdAt).toLocaleString()}</DataTable.Cell>
                    </DataTable.Row>
                  )
                })}
              </DataTable>
            </Card>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
