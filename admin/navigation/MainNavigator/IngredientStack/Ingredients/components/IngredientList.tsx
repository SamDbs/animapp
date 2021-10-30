import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useSearch from '@hooks/useSearch'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, View } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

import { GET_DELETE_INGREDIENTS } from './IngredientDeletedList'

const LIMIT = 5

type Ingredient = { id: string; name: string; review: string; description: string }

export const GET_INGREDIENTS = gql`
  query GetIngredients($offset: Int, $limit: Int, $searchTerms: String = "") {
    ingredients(limit: $limit, offset: $offset, searchTerms: $searchTerms) {
      id
      name
      review
      description
    }
    ingredientsCount(searchTerms: $searchTerms)
  }
`

const DELETE_INGREDIENT = gql`
  mutation DeleteIngredient($id: String!) {
    deleteIngredient(id: $id)
  }
`
const initialPagination = {
  page: 0,
  offset: 0,
}
export default function IngredientList({ style }: { style?: View['props']['style'] }) {
  const [deleteIngredient] = useMutation(DELETE_INGREDIENT, {
    refetchQueries: [GET_INGREDIENTS, GET_DELETE_INGREDIENTS],
  })

  const [pagination, setPagination] = useState(initialPagination)
  const { data, loading, refetch } = useQuery<{
    ingredients: Ingredient[]
    ingredientsCount: number
  }>(GET_INGREDIENTS, {
    variables: { limit: LIMIT, offset: pagination.offset },
  })

  const search = useSearch((searchTerms) => {
    setPagination(initialPagination)
    refetch({ offset: 0, searchTerms })
  })
  const { navigate } = useNavigation()

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Ingredient list</Text>
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
          {data?.ingredients.map((ingredient: any, i: number) => {
            return (
              <DataTable.Row key={ingredient.id}>
                <DataTable.Cell>{ingredient.name}</DataTable.Cell>
                <DataTable.Cell>{ingredient.review}</DataTable.Cell>
                <DataTable.Cell>{ingredient.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('IngredientStack', {
                        screen: 'Ingredient',
                        params: { id: ingredient.id },
                      })
                    }
                  />
                  <IconButton
                    icon="delete"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        deleteIngredient({ variables: { id: ingredient.id } })
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
