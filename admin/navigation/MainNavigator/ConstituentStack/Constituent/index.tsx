import { gql, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldTranslatableQL, { EntityKind } from '@components/FieldTransatableQL'
import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import { ConstituentStackParamList } from '../../../../types'
import { GET_CONSTITUENTS } from '../Constituents/components/ConstituentList'

type Constituent = {
  id: number
  translations: { name: string; description: string; languageId: string }[]
}

const GET_CONSTITUENT = gql`
  query GetConstituent($id: String!) {
    analyticalConstituent(id: $id) {
      id
      translations {
        languageId
        name
        description
      }
    }
  }
`

const fieldsToTranslate = ['name', 'description']
const refreshQueries = [GET_CONSTITUENT, GET_CONSTITUENTS]

export default function ConstituentComponent(
  props: StackScreenProps<ConstituentStackParamList, 'Constituent'>,
) {
  const { data, loading } = useQuery<{ analyticalConstituent: Constituent }>(GET_CONSTITUENT, {
    variables: { id: props.route.params.id },
  })

  return (
    <ScrollView style={{ padding: 16 }}>
      <Card>
        {loading && <ActivityIndicator />}
        {data?.analyticalConstituent && (
          <>
            <View
              style={{
                height: 400,
                width: 400,
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://cdn.stocksnap.io/img-thumbs/960w/vintage-red_8QKIFL9ZUI.jpg',
                }}
                style={{
                  height: 400 - 20,
                  width: 400 - 20,
                  margin: 20 / 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                  resizeMode: 'contain',
                }}
              />
            </View>
            {data.analyticalConstituent.translations && (
              <FieldTranslatableQL
                entityId={props.route.params.id}
                fields={fieldsToTranslate}
                kind={EntityKind.constituent}
                refreshQueries={refreshQueries}
                translations={data?.analyticalConstituent.translations.map(
                  ({ languageId, name, description }) => ({
                    languageId,
                    strings: { name, description },
                  }),
                )}
              />
            )}
          </>
        )}
      </Card>
    </ScrollView>
  )
}
