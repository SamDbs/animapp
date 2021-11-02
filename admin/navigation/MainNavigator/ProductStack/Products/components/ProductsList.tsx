import { gql, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

const LIMIT = 5

export const GET_PRODUCTS = gql`
  query GetProducts(
    $offset: Int
    $limit: Int
    $searchTerms: String = ""
    $filters: ProductsFilters = {}
  ) {
    products(limit: $limit, offset: $offset, searchTerms: $searchTerms, filters: $filters) {
      id
      name
      description
      published
      brand {
        name
      }
    }
    productsCount(searchTerms: $searchTerms, filters: $filters)
  }
`

const initialPagination = {
  page: 0,
  offset: 0,
}

type QueryReturnType = {
  products: { id: string; name: string; published: boolean; brand: { name: string } }[]
  productsCount: number
}

type QueryVariables = {
  limit: number
  offset: number
  filters?: ProductFilters
  searchTerms?: string
}
type ProductFilters = { published?: boolean }

export default function ProductList({ style }: { style?: View['props']['style'] }) {
  const [filters, setFilters] = useState<ProductFilters>({})
  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<QueryReturnType, QueryVariables>(GET_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
    variables: { limit: LIMIT, offset: pagination.offset, filters },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  const { navigate } = useNavigation()

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Product list</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 0,
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filters.published === undefined ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() => setFilters({ published: undefined })}>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#ccc',
              }}
            />
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filters.published === true ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() => setFilters({ published: true })}>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#00ff11',
              }}
            />
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filters.published === false ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() => setFilters({ published: false })}>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#ffff00',
              }}
            />
          </Pressable>
        </View>
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
            <DataTable.Title style={{ flex: 0, flexBasis: 50 }}>Status</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Brand</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {data?.products.map((product) => {
            return (
              <DataTable.Row key={product.id}>
                <DataTable.Cell style={{ flex: 0, flexBasis: 50 }}>
                  <View
                    style={{
                      marginRight: 8,
                      borderRadius: 10,
                      borderWidth: 10,
                      borderColor: product.published ? '#00ff11' : '#ffff00',
                    }}
                  />
                </DataTable.Cell>
                <DataTable.Cell>{product.name}</DataTable.Cell>
                <DataTable.Cell>{product.brand.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    onPress={() =>
                      navigate('ProductStack', {
                        screen: 'Product',
                        params: { id: product.id },
                      })
                    }
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {loading && <ActivityIndicator style={{ margin: 8 }} />}
          {!loading && data?.productsCount === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination({ page: i, offset: LIMIT * i })}
        pagination={{
          count: data?.productsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
