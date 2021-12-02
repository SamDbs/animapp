import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

import { IngredientStackParamList } from '../../../../types'
import { GET_LANGUAGES } from '../Languages/components/LanguageList'

type Language = { id: string; name: string }

const GET_LANGUAGE = gql`
  query GetLanguage($id: String!) {
    language(id: $id) {
      id
      name
    }
  }
`

const UPDATE_LANGUAGE = gql`
  mutation UpdateLanguage($id: String!, $name: String!) {
    updateLanguage(id: $id, name: $name) {
      id
    }
  }
`

export default function LanguageComponent(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const { data, loading } = useQuery<{ language: Language }>(GET_LANGUAGE, {
    variables: { id: props.route.params.id },
  })
  const [updateLanguage] = useMutation<any, { id: string; name: string }>(UPDATE_LANGUAGE, {
    refetchQueries: [GET_LANGUAGES],
  })

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Language</PageHeader>
      <Card>
        {loading && <ActivityIndicator />}
        {data?.language && (
          <View>
            <FieldWithLabel
              delay={250}
              label="Name"
              onChangeValue={(val) =>
                updateLanguage({ variables: { id: data.language.id, name: val } })
              }
              value={data.language.name}
            />
          </View>
        )}
      </Card>
    </ScrollView>
  )
}
