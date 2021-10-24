import { useQuery, gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

type Brand = { id: string; name: string }

const LIMIT = 5

export const GET_BRANDS = gql`
  query GetBrands($offset: Int, $limit: Int = ${LIMIT}, $searchTerms: String = "") {
    brands(limit: $limit, offset: $offset, searchTerms: $searchTerms) {
      id
      name
    }
    brandsCount(searchTerms: $searchTerms)
  }
`

const initialPagination = {
  page: 0,
  offset: 0,
}

const DELETE_BRAND = gql`
  mutation DeleteBrand($id: String!) {
    deleteBrand(id: $id) {
      id
    }
  }
`

export default function BrandList({ style }: { style?: View['props']['style'] }) {
  const [pagination, setPagination] = useState(initialPagination)

  const { data, loading, refetch } = useQuery<{
    brands: Brand[]
    brandsCount: number
  }>(GET_BRANDS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const [deleteBrand] = useMutation(DELETE_BRAND, {
    refetchQueries: [GET_BRANDS],
  })

  const { navigate } = useNavigation()

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Brand list</Text>
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
          {data?.brands.map((brand) => {
            return (
              <DataTable.Row key={brand.id}>
                <DataTable.Cell>{brand.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('BrandStack', {
                        screen: 'Brand',
                        params: { id: brand.id },
                      })
                    }
                  />
                  <IconButton
                    icon="delete"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        await deleteBrand({ variables: { id: brand.id } })
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
        onChangePage={(i) => setPagination((x) => ({ ...x, page: i, offset: LIMIT * i }))}
        pagination={{
          count: data?.brandsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
