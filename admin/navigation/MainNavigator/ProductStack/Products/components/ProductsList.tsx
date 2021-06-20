import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useProductsStore, { ProductStore, Product } from '@hooks/stores/product'
import useSearchableList from '@hooks/useSearchableList'
import { Link } from '@react-navigation/native'
import React, { SetStateAction, useCallback, useState } from 'react'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'

export default function ProductList({ style }: { style?: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: products,
    noResult,
    pagination,
    searchDebounced,
    setFilters,
  } = useSearchableList<ProductStore, Product>(
    useProductsStore,
    (state) => state.searchProducts,
    (ids) => (state) => ids.map((id) => state.products[id]),
  )

  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>()

  const changeFilterPublished = useCallback((cb: any) => {
    const newValue = cb(setFilterPublished)
    if (newValue === 'draft' || newValue === 'published')
      setFilters({ published: newValue === 'published' ? 1 : 0 })
    else setFilters({})
    setFilterPublished(newValue)
  }, [])

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Product list</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 0,
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filterPublished === 'all' ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() =>
              changeFilterPublished((current: any) => (current !== 'all' ? 'all' : undefined))
            }>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#ccc',
              }}
            />
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filterPublished === 'published' ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() =>
              changeFilterPublished((current: any) =>
                current !== 'published' ? 'published' : undefined,
              )
            }>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#00ff11',
              }}
            />
          </Pressable>
          <Pressable
            style={{
              alignItems: 'center',
              backgroundColor: filterPublished === 'draft' ? '#eee' : 'transparent',
              borderColor: '#ccc',
              borderWidth: 1,
              cursor: 'pointer',
              justifyContent: 'center',
            }}
            onPress={() =>
              changeFilterPublished((current: any) => (current !== 'draft' ? 'draft' : undefined))
            }>
            <View
              style={{
                margin: 8,
                borderRadius: 10,
                borderWidth: 10,
                borderColor: '#ffff00',
              }}
            />
          </Pressable>
        </View>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    marginRight: 8,
                    borderRadius: 10,
                    borderWidth: 10,
                    borderColor: product.published ? '#00ff11' : '#ffff00',
                  }}
                />

                <Text>{product.name}</Text>
              </View>
              <Link to={`/products/${product.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
      <ActivityIndicator style={{ margin: 8 }} color={isLoading ? undefined : 'transparent'} />
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
