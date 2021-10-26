import { useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldTranslatableQL, { EntityKind } from '@components/FieldTransatableQL'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import gql from 'graphql-tag'
import React from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'

import { FaqStackParamList } from '../../../../types'
import { GET_FAQS } from '../Faqs/components/FaqList'

type Faq = { id: string; translations: { question: string; answer: string; languageId: string }[] }

export const GET_FAQ = gql`
  query GetFaq($id: String!) {
    faq(id: $id) {
      id
      translations {
        languageId
        question
        answer
      }
    }
  }
`

const queriesToRefresh = [GET_FAQ, GET_FAQS]
const fieldsToTranslate = ['question', 'answer']

export default function FaqComponent(props: StackScreenProps<FaqStackParamList, 'Faq'>) {
  const { data, loading } = useQuery<{ faq: Faq }>(GET_FAQ, {
    variables: { id: props.route.params.id },
  })

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Question &amp; Answer</PageHeader>
      <Card>
        {loading && <ActivityIndicator />}
        {data?.faq.translations && (
          <FieldTranslatableQL
            entityId={props.route.params.id}
            fields={fieldsToTranslate}
            kind={EntityKind.faq}
            refreshQueries={queriesToRefresh}
            translations={data?.faq.translations.map(({ languageId, question, answer }) => ({
              languageId,
              strings: { question, answer },
            }))}
          />
        )}
      </Card>
    </ScrollView>
  )
}
