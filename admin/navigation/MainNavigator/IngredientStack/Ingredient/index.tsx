import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import useIngredientsStore from '@hooks/stores/ingredient'

import { IngredientStackParamList } from '../../../../types'

export default function Ingredient(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const ingredient = useIngredientsStore((state) => state.ingredients[props.route.params.id])
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
    async function fn() {
      setIsLoading(true)
      const { id } = await getIngredientById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <ScrollView style={{ padding: 16 }}>
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
              <FieldWithLabel
                label="Name"
                value={ingredient.name}
                onChangeValue={(val) => updateIngredient(ingredient.id, { name: val })}
              />
              <FieldWithLabel
                label="Description"
                value={ingredient.description}
                onChangeValue={(val) => updateIngredient(ingredient.id, { description: val })}
              />
              <FieldWithLabel
                label="Review"
                value={ingredient.review}
                onChangeValue={(val) => updateIngredient(ingredient.id, { review: val })}
              />
              <FieldWithLabel
                label="Image"
                value={ingredient.image}
                onChangeValue={(val) => updateIngredient(ingredient.id, { image: val })}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
