import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import React, { useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

import { GET_INGREDIENTS } from './IngredientList'

const LIMIT = 5

type Ingredient = { id: string; name: string; review: string; description: string }

export const GET_DELETE_INGREDIENTS = gql`
  query GetDeletedIngredients($offset: Int, $limit: Int, $searchTerms: String = "") {
    ingredients(
      limit: $limit
      offset: $offset
      searchTerms: $searchTerms
      filters: { deleted: true }
    ) {
      id
      name
      review
      description
    }
    ingredientsCount(searchTerms: $searchTerms, filters: { deleted: true })
  }
`
const initialPagination = {
  page: 0,
  offset: 0,
}

const RESTORE_INGREDIENT = gql`
  mutation RestoreIngredient($id: String!) {
    restoreIngredient(id: $id)
  }
`

export default function IngredientDeletedList({ style }: { style?: View['props']['style'] }) {
  const [restoreIngredient] = useMutation(RESTORE_INGREDIENT, {
    refetchQueries: [GET_INGREDIENTS, GET_DELETE_INGREDIENTS],
  })
  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<{
    ingredients: Ingredient[]
    ingredientsCount: number
  }>(GET_DELETE_INGREDIENTS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Deleted ingredients</Text>
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
            <DataTable.Title>Review</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>

          {data?.ingredients.map((ingredient, i: number) => {
            return (
              <DataTable.Row key={ingredient.id}>
                <DataTable.Cell>{ingredient.name}</DataTable.Cell>
                <DataTable.Cell>{ingredient.review}</DataTable.Cell>
                <DataTable.Cell>{ingredient.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete-restore"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        restoreIngredient({ variables: { id: ingredient.id } })
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
          {!loading && data?.ingredients.length === 0 && <NoResult />}
        </DataTable>
      </View>
      <Pagination
        onChangePage={(i) => setPagination({ page: i, offset: LIMIT * i })}
        pagination={{
          count: data?.ingredientsCount ?? 0,
          limit: LIMIT,
          page: pagination.page,
        }}
      />
    </Card>
  )
}
