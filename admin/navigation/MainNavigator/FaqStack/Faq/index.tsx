import { useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldTranslatableQL, { EntityKind } from '@components/FieldTransatableQL'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import gql from 'graphql-tag'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import { FaqStackParamList } from '../../../../types'

type Faq = { id: string; translations: { question: string; answer: string; languageId: string }[] }

const GET_FAQ = gql`
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

export default function FaqComponent(props: StackScreenProps<FaqStackParamList, 'Faq'>) {
  const { data, loading, error } = useQuery<{ faq: Faq }>(GET_FAQ, {
    variables: { id: props.route.params.id },
  })

  console.log('error', error)
  console.log('faq', data)

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Question &amp; Answer</PageHeader>
      <Card>
        {loading && <ActivityIndicator />}
        {data && (
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
            <View>
              {data?.faq.translations && (
                <FieldTranslatableQL
                  entityId={props.route.params.id}
                  kind={EntityKind.faq}
                  fields={['question', 'answer']}
                  translations={data?.faq.translations.map(({ languageId, question, answer }) => ({
                    languageId,
                    strings: { question, answer },
                  }))}
                />
              )}

              {/* <FieldTranslatable<FaqEntity, FaqTranslation, FaqTranslationStore>
                fields={{ question: 'Question', answer: 'Answer' }}
                baseEntityId={faq.id}
                useStore={useFaqTranslationStore}
                translationGetterSelector={(state) => state.getFaqTranslations}
                translationUpdaterSelector={(state) => state.updateFaqTranslation}
                translationsSelectorCreator={(ids) => (state) =>
                  ids.map((id) => state.faqTranslations[id])}
              /> */}
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
