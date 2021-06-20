import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useConstituentsStore, { ConstituentStoreState, Constituent } from '@hooks/stores/constituent'
import useSearchableList from '@hooks/useSearchableList'
import { Link } from '@react-navigation/native'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

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
        {constituents.filter(Boolean).map((constituent, i: number) => {
          return (
            <View
              key={constituent.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === constituents.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{constituent.name}</Text>
              <Text>{constituent.description}</Text>
              <Link to={`/constituents/${constituent.id}`}>
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
