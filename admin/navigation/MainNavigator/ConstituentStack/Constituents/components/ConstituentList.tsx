import { gql, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

const LIMIT = 5
export type Constituent = { id: string; name: string; description: string }
export type QueryReturnType = {
  analyticalConstituents: Constituent[]
  analyticalConstituentsCount: number
}

export const GET_CONSTITUENTS = gql`
  query GetConstituents($offset: Int, $limit: Int, $searchTerms: String = "") {
    analyticalConstituents(limit: $limit, offset: $offset, searchTerms: $searchTerms) {
      id
      name
      description
    }
    analyticalConstituentsCount(searchTerms: $searchTerms)
  }
`
const initialPagination = {
  page: 0,
  offset: 0,
}

export default function ConstituentList({ style }: { style: View['props']['style'] }) {
  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<QueryReturnType>(GET_CONSTITUENTS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  const { navigate } = useNavigation()

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Analytical Constituent list</Text>
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
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {data?.analyticalConstituents.map((constituent, i: number) => {
            return (
              <DataTable.Row key={constituent.id}>
                <DataTable.Cell>{constituent.name}</DataTable.Cell>
                <DataTable.Cell>{constituent.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('ConstituentStack', {
                        screen: 'Constituent',
                        params: { id: constituent.id },
                      })
                    }
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {loading && <ActivityIndicator style={{ margin: 8 }} />}
          {!loading && data?.analyticalConstituents.length === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination({ page: i, offset: LIMIT * i })}
        pagination={{
          count: data?.analyticalConstituentsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
