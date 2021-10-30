import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldTranslatableQL, { EntityKind } from '@components/FieldTransatableQL'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

import { IngredientStackParamList } from '../../../../types'
import { GET_INGREDIENTS } from '../Ingredients/components/IngredientList'

type Ingredient = {
  id: number
  rating: number
  translations: { name: string; review: string; description: string; languageId: string }[]
}
const GET_INGREDIENT = gql`
  query GetIngredient($id: String!) {
    ingredient(id: $id) {
      id
      rating
      translations {
        languageId
        name
        review
        description
      }
    }
  }
`

const UPDATE_INGREDIENT = gql`
  mutation UpdateIngredient($id: String!, $rating: Int!) {
    updateIngredient(id: $id, rating: $rating) {
      id
    }
  }
`

const fieldsToTranslate = ['name', 'review', 'description']
const refreshQueries = [GET_INGREDIENT, GET_INGREDIENTS]

export default function IngredientComponent(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const { data, loading } = useQuery<{ ingredient: Ingredient }>(GET_INGREDIENT, {
    variables: { id: props.route.params.id },
  })
  const [updateIngredient] =
    useMutation<{ updateIngredient: { id: number } }, { id: number; rating?: number }>(
      UPDATE_INGREDIENT,
    )

  const [error, setError] = useState('')

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Ingredient</PageHeader>
      <Card>
        {loading && <ActivityIndicator />}
        {data?.ingredient && (
          <>
            <View>
              <FieldWithLabel
                delay={250}
                label="Rating (0 = neutral, 1 = good, 2 = bad)"
                value={data.ingredient.rating?.toString() ?? ''}
                onChangeValue={async (val) => {
                  try {
                    await updateIngredient({
                      variables: { id: data.ingredient.id, rating: Number(val) },
                    })
                    setError('')
                  } catch {
                    setError('Invalid rating, please choose a number between 0 and 2.')
                  }
                }}
              />
              {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}
            </View>
            <View>
              {data.ingredient.translations && (
                <FieldTranslatableQL
                  entityId={props.route.params.id}
                  fields={fieldsToTranslate}
                  kind={EntityKind.ingredient}
                  refreshQueries={refreshQueries}
                  translations={data.ingredient.translations.map(
                    ({ languageId, name, description, review }) => ({
                      languageId,
                      strings: { name, description, review },
                    }),
                  )}
                />
              )}
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
