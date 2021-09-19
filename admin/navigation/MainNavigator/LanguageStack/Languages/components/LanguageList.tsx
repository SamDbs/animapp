import Card from '@components/Card'
import useLanguageStore from '@hooks/stores/languages'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

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

  const { navigate } = useNavigation()

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
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {languages.filter(Boolean).map((language, i: number) => {
            return (
              <DataTable.Row key={language.id}>
                <DataTable.Cell>{language.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('LanguageStack', {
                        screen: 'Language',
                        params: { id: language.id },
                      })
                    }
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
        </DataTable>
      </View>
    </Card>
  )
}
