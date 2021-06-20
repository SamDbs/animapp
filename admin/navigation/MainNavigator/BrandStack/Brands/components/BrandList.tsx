import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useBrandStore, { BrandStore, Brand } from '@hooks/stores/brand'
import useSearchableList from '@hooks/useSearchableList'
import { Link } from '@react-navigation/native'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

export default function BrandList({ style }: { style?: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: brands,
    noResult,
    pagination,
    searchDebounced,
  } = useSearchableList<BrandStore, Brand>(
    useBrandStore,
    (state) => state.searchBrands,
    (ids) => (state) => ids.map((id) => state.brands[id]),
  )

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
          marginBottom: 8,
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
        {brands.filter(Boolean).map((brand: any, i: number) => {
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
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
