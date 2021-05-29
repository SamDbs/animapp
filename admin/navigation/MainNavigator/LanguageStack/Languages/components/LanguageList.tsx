import { debounce } from 'lodash/fp'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import useLanguageStore from '@hooks/stores/languages'
import Card from '@components/Card'

export default function IngredientList({ style }: { style: View['props']['style'] }) {
  const [ids, setIngredientIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const [registerIds, unregisterIds, getIngredients] = useLanguageStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getAllLanguages,
  ])
  const ingredients = useLanguageStore(
    useCallback((state) => ids.map((id) => state.languages[id]), [ids]),
  )

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

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
      <Text style={{ fontSize: 18 }}>Language list</Text>
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
              <Pressable onPress={() => navigation.navigate(`Language`, { id: ingredient.id })}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Pressable>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
