import Card from '@components/Card'
import Pagination from '@components/Pagination'
import { FontAwesome5 } from '@expo/vector-icons'
import useBrandStore, { BrandStore, Brand } from '@hooks/stores/brand'
import useSearchableList from '@hooks/useSearchableList'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'

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
    (state) => state.searchDeletedBrands,
    (ids) => (state) => ids.map((id) => state.brands[id]),
  )
  const restoreBrand = useBrandStore((state) => state.restoreBrand)

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Deleted brands</Text>
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
                alignItems: 'center',
              }}>
              <Text>{brand.name}</Text>

              <Pressable
                style={{ cursor: 'pointer' }}
                onPress={async () => {
                  try {
                    await restoreBrand(brand.id)
                    location.reload()
                  } catch (error) {
                    alert(error.response.data.message)
                  }
                }}>
                <FontAwesome5 name="trash-restore" size={24} color="green" />
              </Pressable>
            </View>
          )
        })}
      </View>
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
