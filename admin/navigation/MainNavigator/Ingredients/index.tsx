import React, { useCallback, useEffect } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

import debounce from '../../../utils/debounce'

import { getIngredients, searchIngredients } from '../../../features/ingredients/actions'
import { useDispatch, useSelector } from '../../../hooks/redux'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Ingredients dashboard</Text>
    </View>
  )
}

function IngredientList({ isLoading, ingredients }: any) {
  const dispatch = useDispatch()
  const noResult = !ingredients.length
  const searchDebounced = useCallback(
    debounce((text: string) => dispatch(searchIngredients({ name: text })), 500),
    [],
  )

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'rgba(4,9,20,0.10)',
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
      }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18 }}>Ingredient list</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          padding: 16,
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
          margin: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
        {noResult && (
          <View>
            <Text>no result sorry</Text>
          </View>
        )}
        {ingredients.map((ingredient: any, i: number) => {
          return (
            <View
              key={ingredient.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === ingredients.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
              }}>
              <Text>{ingredient.name}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default function Ingredients() {
  const dispatch = useDispatch()
  const ingredients = useSelector((state) =>
    state.ingredients.ids.map((id) => state.ingredients.entities[id]),
  )
  const isLoading = useSelector((state) => state.ingredients.isLoading)

  useEffect(() => {
    dispatch(getIngredients())
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <IngredientList isLoading={isLoading} ingredients={ingredients} />
    </View>
  )
}
