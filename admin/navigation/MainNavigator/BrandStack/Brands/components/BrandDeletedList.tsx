import Card from '@components/Card'
import NoResult from '@components/NoResult'
import Pagination from '@components/Pagination'
import { FontAwesome5 } from '@expo/vector-icons'
import useBrandStore, { BrandStore, Brand } from '@hooks/stores/brand'
import useSearchableList from '@hooks/useSearchableList'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator, Pressable } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

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
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>

          {brands.filter(Boolean).map((brand: any, i: number) => {
            return (
              <DataTable.Row key={brand.id}>
                <DataTable.Cell>{brand.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete-restore"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        await restoreBrand(brand.id)
                        location.reload()
                      } catch (error: any) {
                        alert(error.response.data.message)
                      }
                    }}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
          {!isLoading && noResult && <NoResult />}
        </DataTable>
      </View>
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
