import Card from '@components/Card'
import useIngredientsStore from '@hooks/stores/ingredient'
import { Link } from '@react-navigation/native'
import { debounce } from 'lodash/fp'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

export default function IngredientList({ style }: { style: View['props']['style'] }) {
  const [ids, setIngredientIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds, getIngredients, searchIngredients] = useIngredientsStore(
    (state) => [
      state.registerIds,
      state.unregisterIds,
      state.getIngredients,
      state.searchIngredients,
    ],
  )
  const ingredients = useIngredientsStore(
    useCallback((state) => ids.map((id) => state.ingredients[id]), [ids]),
  )

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchIngredients(text)
      setIngredientIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getIngredients()
      setIngredientIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !ingredients.length

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
        {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
        {noResult && (
          <View style={{ padding: 8 }}>
            <Text>No result.</Text>
          </View>
        )}
        {ingredients.filter(Boolean).map((ingredient, i: number) => {
          return (
            <View
              key={ingredient.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === ingredients.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{ingredient.name}</Text>
              <Text>{ingredient.review}</Text>
              <Text>{ingredient.description}</Text>
              <Text>{ingredient.image}</Text>
              <Link to={`/ingredients/${ingredient.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
