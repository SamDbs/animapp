import { debounce } from 'lodash/fp'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'
import { Link, useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import useConstituentsStore from '@hooks/stores/constituent'
import Card from '@components/Card'

export default function ConstituentList({ style }: { style: View['props']['style'] }) {
  const [ids, setConstituentIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const [registerIds, unregisterIds, getConstituents, searchConstituents] = useConstituentsStore(
    (state) => [
      state.registerIds,
      state.unregisterIds,
      state.getConstituents,
      state.searchConstituents,
    ],
  )
  const constituents = useConstituentsStore(
    useCallback((state) => ids.map((id) => state.constituents[id]), [ids]),
  )

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchConstituents(text)
      setConstituentIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getConstituents()
      setConstituentIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !constituents.length

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Analytical Constituent list</Text>
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
        {constituents.filter(Boolean).map((constituent, i: number) => {
          return (
            <View
              key={constituent.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === constituents.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{constituent.name}</Text>
              <Text>{constituent.description}</Text>
              <Link to={`/constituents/${constituent.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
