import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import { PageHeader } from '@components/Themed'
import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import useIngredientsStore, { Ingredient as IngredientEntity } from '@hooks/stores/ingredient'

import { IngredientStackParamList } from '../../../../types'
import useIngredientTranslationStore, {
  IngredientTranslation,
  IngredientTranslationStore,
} from '@hooks/stores/ingredientTranslation'

export default function Ingredient(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const ingredient = useIngredientsStore((state) => state.ingredients[props.route.params.id])
  const [registerIds, unregisterIds, getIngredientById] = useIngredientsStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getIngredientById,
  ])

  useEffect(() => {
    if (!ingredient) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getIngredientById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [props.route.params.id])

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Ingredient</PageHeader>
      <Card>
        {isLoading && !ingredient && <ActivityIndicator />}
        {ingredient && (
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
              <FieldTranslatable<
                IngredientEntity,
                IngredientTranslation,
                IngredientTranslationStore
              >
                fields={{ description: 'Description', review: 'Review', name: 'Name' }}
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
