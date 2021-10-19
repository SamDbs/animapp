import { useQuery, gql } from '@apollo/client'
import Card from '@components/Card'
import NoResult from '@components/NoResult'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { DataTable, IconButton } from 'react-native-paper'

type Language = { id: string; name: string }

const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      id
      name
    }
    languagesCount
  }
`

export default function LanguageList({ style }: { style: View['props']['style'] }) {
  const { data, loading } =
    useQuery<{
      languages: Language[]
      languagesCount: number
    }>(GET_LANGUAGES)

  const { navigate } = useNavigation()

  const noResult = !data?.languages.length

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Language list</Text>
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
          {data?.languages.map((language, i) => {
            return (
              <DataTable.Row key={language.id}>
                <DataTable.Cell>{language.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    style={{ margin: 0 }}
                    onPress={() =>
                      navigate('LanguageStack', {
                        screen: 'Language',
                        params: { id: language.id },
                      })
                    }
                  />
                </DataTable.Cell>
              </DataTable.Row>
            )
          })}
          {loading && <ActivityIndicator style={{ margin: 8 }} />}
          {!loading && noResult && <NoResult />}
        </DataTable>
      </View>
    </Card>
  )
}
