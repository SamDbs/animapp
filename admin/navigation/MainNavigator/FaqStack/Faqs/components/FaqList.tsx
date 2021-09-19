import Card from '@components/Card'
import Pagination from '@components/Pagination'
import useFaqStore, { FaqStoreState, Faq } from '@hooks/stores/faq'
import useSearchableList from '@hooks/useSearchableList'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

export default function FaqList({ style }: { style: View['props']['style'] }) {
  const {
    changePage,
    isLoading,
    items: faqs,
    noResult,
    pagination,
    searchDebounced,
  } = useSearchableList<FaqStoreState, Faq>(
    useFaqStore,
    (state) => state.searchFaqs,
    (ids) => (state) => ids.map((id) => state.faqs[id]),
  )
  const { navigate } = useNavigation()

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Faq list</Text>
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
            <DataTable.Title>Question</DataTable.Title>
            <DataTable.Title>Answer</DataTable.Title>
            <DataTable.Title numeric>Actions</DataTable.Title>
          </DataTable.Header>
          {faqs.filter(Boolean).map((faq, i: number) => {
            return (
              <DataTable.Row key={faq.id}>
                <DataTable.Cell>{faq.question}</DataTable.Cell>
                <DataTable.Cell>{faq.answer}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('FaqStack', {
                        screen: 'Faq',
                        params: { id: faq.id },
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
