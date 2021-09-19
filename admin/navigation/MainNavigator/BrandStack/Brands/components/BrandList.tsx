import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useBrandStore, { BrandStore, Brand } from '@hooks/stores/brand'
import useSearchableList from '@hooks/useSearchableList'
import { useNavigation } from '@react-navigation/native'
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
    (state) => state.searchBrands,
    (ids) => (state) => ids.map((id) => state.brands[id]),
  )
  const { navigate } = useNavigation()
  const deleteBrand = useBrandStore((state) => state.deleteBrand)

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
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('BrandStack', {
                        screen: 'Brand',
                        params: { id: brand.id },
                      })
                    }
                  />
                  <IconButton
                    icon="delete"
                    style={{ margin: 0 }}
                    onPress={async () => {
                      try {
                        await deleteBrand(brand.id)
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
        </DataTable>
      </View>
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
