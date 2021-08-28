import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import useIngredientsStore, { Ingredient as IngredientEntity } from '@hooks/stores/ingredient'
import useIngredientTranslationStore, {
  IngredientTranslation,
  IngredientTranslationStore,
} from '@hooks/stores/ingredientTranslation'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'

import { IngredientStackParamList } from '../../../../types'

export default function Ingredient(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const ingredient = useIngredientsStore((state) => state.ingredients[props.route.params?.id])
  const [registerIds, unregisterIds, getIngredientById, updateIngredient] = useIngredientsStore(
    (state) => [
      state.registerIds,
      state.unregisterIds,
      state.getIngredientById,
      state.updateIngredient,
    ],
  )

  useEffect(() => {
    if (!ingredient) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    if (!props.route.params?.id) return
    async function fn() {
      setIsLoading(true)
      const { id } = await getIngredientById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [props.route.params?.id])

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Ingredient</PageHeader>
      <Card>
        {isLoading && !ingredient && <ActivityIndicator />}
        {ingredient && (
          <>
            <View>
              <FieldWithLabel
                label="Rating (0 = neutral, 1 = good, 2 = bad)"
                value={ingredient.rating}
                onChangeValue={async (val) => {
                  try {
                    await updateIngredient(ingredient.id, { rating: val })
                    setError('')
                  } catch (e) {
                    setError('The number might be between 0 and 2')
                  }
                }}
              />
              <Text style={{ color: 'red' }}>{error}</Text>
            </View>
            <View>
              <FieldTranslatable<
                IngredientEntity,
                IngredientTranslation,
                IngredientTranslationStore
              >
                fields={{ name: 'Name', description: 'Description', review: 'Review' }}
                baseEntityId={ingredient.id}
                useStore={useIngredientTranslationStore}
                translationGetterSelector={(state) => state.getIngredientTranslations}
                translationUpdaterSelector={(state) => state.updateIngredientTranslation}
                translationsSelectorCreator={(ids) => (state) =>
                  ids.map((id) => state.ingredientTranslations[id])}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
