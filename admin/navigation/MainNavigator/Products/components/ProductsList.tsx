import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

import Card from '@components/Card'

import debounce from '../../../../utils/debounce'
import { useProductsStore, Product } from '../../../../stores'

export default function ProductList({ isLoading, style }: any) {
  const [productIds, setProductIds] = useState<Product['id'][]>([])
  const productEntities = useProductsStore((state) => state.products)
  const getProducts = useProductsStore((state) => state.getProducts)
  const searchProducts = useProductsStore((state) => state.searchProducts)

  const searchDebounced = useCallback(
    debounce(async (text: string) => {
      const { ids } = await searchProducts({ name: text })
      setProductIds(ids)
    }, 500),
    [],
  )

  useEffect(() => {
    async function fn() {
      const { ids } = await getProducts()
      setProductIds(ids)
    }
    fn()
  }, [])

  const products = productIds.map((id) => productEntities[id])
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
          <View>
            <Text>no result sorry</Text>
          </View>
        )}
        {products.map((product: any, i: number) => {
          return (
            <View
              key={product.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === products.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
              }}>
              <Text>{product.name}</Text>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
