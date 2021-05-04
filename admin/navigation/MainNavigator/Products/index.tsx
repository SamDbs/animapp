import React, { useCallback, useEffect } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

import debounce from '../../../utils/debounce'

import { getProducts, searchProducts } from '../../../features/products/actions'
import { useDispatch, useSelector } from '../../../hooks/redux'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Products dashboard</Text>
    </View>
  )
}

function ProductList({ isLoading, products }: any) {
  const dispatch = useDispatch()
  const noResult = !products.length
  const searchDebounced = useCallback(
    debounce((text: string) => dispatch(searchProducts({ name: text })), 500),
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
        <Text style={{ fontSize: 18 }}>Product list</Text>
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
    </View>
  )
}
export default function Products() {
  const dispatch = useDispatch()
  const products = useSelector((state) =>
    state.products.ids.map((id) => state.products.entities[id]),
  )
  const isLoading = useSelector((state) => state.products.isLoading)

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <ProductList isLoading={isLoading} products={products} />
    </View>
  )
}
