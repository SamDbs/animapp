import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

import { GET_BRANDS } from './BrandList'

const LIMIT = 5

type Brand = { id: string; name: string }

export const GET_DELETE_BRANDS = gql`
  query GetDeletedBrands($offset: Int, $limit: Int, $searchTerms: String = "") {
    brands(limit: $limit, offset: $offset, searchTerms: $searchTerms, filters: { deleted: true }) {
      id
      name
    }
    brandsCount(searchTerms: $searchTerms, filters: { deleted: true })
  }
`
const initialPagination = {
  page: 0,
  offset: 0,
}

const RESTORE_BRAND = gql`
  mutation RestoreBrand($id: String!) {
    restoreBrand(id: $id) {
      id
    }
  }
`

export default function BrandDeletedList({ style }: { style?: View['props']['style'] }) {
  const [restoreBrand] = useMutation(RESTORE_BRAND, {
    refetchQueries: [GET_BRANDS, GET_DELETE_BRANDS],
  })
  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<{
    brands: Brand[]
    brandsCount: number
  }>(GET_DELETE_BRANDS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Deleted brands</Text>
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
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>

          {data?.brands.filter(Boolean).map((brand: any, i: number) => {
            return (
              <DataTable.Row key={brand.id}>
                <DataTable.Cell>{brand.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete-restore"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        await restoreBrand({ variables: { id: brand.id } })
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
          {!loading && data?.brands.length === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination({ page: i, offset: LIMIT * i })}
        pagination={{
          count: data?.brandsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
