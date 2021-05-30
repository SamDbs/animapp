import { debounce } from 'lodash/fp'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { Link } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import useBrandStore from '@hooks/stores/brand'
import Card from '@components/Card'

export default function BrandList({ style }: { style: View['props']['style'] }) {
  const [ids, setBrandIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds, getBrands, searchBrands] = useBrandStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getBrands,
    state.searchBrands,
  ])
  const brands = useBrandStore(useCallback((state) => ids.map((id) => state.brands[id]), [ids]))

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchBrands(text)
      setBrandIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getBrands()
      setBrandIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !brands.length

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Brand list</Text>
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
        {brands.filter(Boolean).map((brand, i: number) => {
          return (
            <View
              key={brand.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === brands.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{brand.name}</Text>
              <Link to={`/brands/${brand.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
