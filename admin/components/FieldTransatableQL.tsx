import { DocumentNode, gql, useMutation } from '@apollo/client'
import useLanguages from '@hooks/useLanguages'
import { debounce } from 'lodash/fp'
import React, { useCallback } from 'react'
import { Text, TextInput, View } from 'react-native'

export enum EntityKind {
  'ingredient' = 'ingredient',
  'product' = 'product',
  'faq' = 'faq',
  'constituent' = 'constituent',
}

type Props = {
  entityId: string
  fields: string[]
  kind: EntityKind
  translations: { languageId: string; strings: Record<Props['fields'][number], string> }[]
  refreshQueries?: DocumentNode[]
}

const UPDATE_TRANSLATION = gql`
  mutation UpdateTranslation(
    $kind: String!
    $entityId: String!
    $languageId: String!
    $description: String
    $name: String
    $answer: String
    $question: String
    $review: String
  ) {
    updateTranslation(
      kind: $kind
      entityId: $entityId
      languageId: $languageId
      description: $description
      name: $name
      answer: $answer
      question: $question
      review: $review
    )
  }
`

export default function FieldTranslatableQL(props: Props) {
  const { entityId, kind } = props
  const languages = useLanguages()

  const [updateTranslation] = useMutation(UPDATE_TRANSLATION, {
    refetchQueries: props.refreshQueries,
  })

  const debouncedUpdate = useCallback(
    debounce(500, async (params: any) => {
      updateTranslation(params)
    }),
    [],
  )

  if (!languages?.length)
    return (
      <View>
        <Text>Loading languages...</Text>
      </View>
    )

  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <Text>Translations</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {languages.map((l, i) => (
          <View
            key={l.id}
            style={{
              width: '50%',
              paddingLeft: i % 2 === 0 ? 0 : 4,
              paddingRight: i % 2 === 0 ? 4 : 0,
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                marginBottom: 8,
                borderRadius: 3,
                paddingHorizontal: 8,
              }}>
              <Text style={{ marginVertical: 8, fontWeight: 'bold' }}>{l.name}</Text>
              {props.fields.map((field, i) => {
                const currentTranslation = props.translations.find(
                  (translation) => translation.languageId === l.id,
                )

                return (
                  <View key={field as string} style={{ paddingVertical: 8 }}>
                    <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                      <View style={{ width: 100 }}>
                        <Text>{field}</Text>
                      </View>
                      <TextInput
                        style={{
                          padding: 8,
                          borderColor: '#ccc',
                          borderWidth: 1,
                          borderRadius: 3,
                          flex: 1,
                        }}
                        multiline
                        numberOfLines={2}
                        onChangeText={(text) => {
                          debouncedUpdate({
                            variables: { kind, entityId, languageId: l.id, [field]: text },
                          })
                        }}
                        defaultValue={
                          currentTranslation?.strings[field]
                            ? currentTranslation?.strings[field]
                            : ''
                        }
                      />
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
