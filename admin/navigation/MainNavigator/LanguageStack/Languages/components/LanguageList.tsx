import { Text, View, ActivityIndicator } from 'react-native'
import { Link } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import useLanguageStore from '@hooks/stores/languages'
import Card from '@components/Card'

export default function IngredientList({ style }: { style: View['props']['style'] }) {
  const [ids, setIngredientIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds, getIngredients] = useLanguageStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getAllLanguages,
  ])
  const languages = useLanguageStore(
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

  const noResult = !languages.length

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
        {languages.filter(Boolean).map((language, i: number) => {
          return (
            <View
              key={language.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === languages.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{language.name}</Text>
              <Link to={`/languages/${language.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
