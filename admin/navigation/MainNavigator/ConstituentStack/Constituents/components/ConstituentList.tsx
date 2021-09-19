import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useConstituentsStore, { ConstituentStoreState, Constituent } from '@hooks/stores/constituent'
import useSearchableList from '@hooks/useSearchableList'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

export default function ConstituentList({ style }: { style: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: constituents,
    noResult,
    pagination,
    searchDebounced,
  } = useSearchableList<ConstituentStoreState, Constituent>(
    useConstituentsStore,
    (state) => state.searchConstituents,
    (ids) => (state) => ids.map((id) => state.constituents[id]),
  )

  const { navigate } = useNavigation()

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
        {noResult && (
          <View style={{ padding: 8 }}>
            <Text>No result.</Text>
          </View>
        )}
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Description</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {constituents.filter(Boolean).map((constituent, i: number) => {
            return (
              <DataTable.Row key={constituent.id}>
                <DataTable.Cell>{constituent.name}</DataTable.Cell>
                <DataTable.Cell>{constituent.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('ConstituentStack', {
                        screen: 'Constituent',
                        params: { id: constituent.id },
                      })
                    }
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
        </DataTable>
      </View>
      <ActivityIndicator style={{ margin: 8 }} color={isLoading ? undefined : 'transparent'} />
      <Pagination onChangePage={changePage} pagination={pagination} />
    </Card>
  )
}
