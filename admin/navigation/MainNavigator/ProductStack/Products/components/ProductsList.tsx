import { debounce } from 'lodash/fp'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'

import useProductsStore from '@hooks/stores/product'
import Card from '@components/Card'

export default function ProductList({ style }: { style: View['props']['style'] }) {
  const [ids, setProductIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const [registerIds, unregisterIds, getProducts, searchProducts] = useProductsStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getProducts,
    state.searchProducts,
  ])
  const products = useProductsStore(
    useCallback((state) => ids.map((id) => state.products[id]), [ids]),
  )

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchProducts({ name: text })
      setProductIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getProducts()
      setProductIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !products.length

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Product list</Text>
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
        {products.filter(Boolean).map((product: any, i: number) => {
          return (
            <View
              key={product.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === products.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{product.name}</Text>
              <Pressable onPress={() => navigation.navigate(`Product`, { id: product.id })}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Pressable>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
