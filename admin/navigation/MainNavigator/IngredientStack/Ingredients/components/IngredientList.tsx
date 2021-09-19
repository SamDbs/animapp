import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import useIngredientsStore, { Ingredient, IngredientStore } from '@hooks/stores/ingredient'
import useSearchableList from '@hooks/useSearchableList'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ActivityIndicator, Text, TextInput, View } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

export default function IngredientList({ style }: { style?: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: ingredients,
    noResult,
    pagination,
    searchDebounced,
  } = useSearchableList<IngredientStore, Ingredient>(
    useIngredientsStore,
    (state) => state.searchIngredients,
    (ids) => (state) => ids.map((id) => state.ingredients[id]),
  )

  const { navigate } = useNavigation()

  const deleteIngredient = useIngredientsStore((state) => state.deleteIngredient)

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
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Review</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {ingredients.filter(Boolean).map((ingredient: any, i: number) => {
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
                        await deleteIngredient(ingredient.id)
                        location.reload()
                      } catch (error: any) {
                        alert(error.response.data.message)
                      }
                    }}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
          {!isLoading && noResult && <NoResult />}
        </DataTable>
      </View>
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
