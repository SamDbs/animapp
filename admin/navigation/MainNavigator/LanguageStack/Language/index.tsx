import { ActivityIndicator, ScrollView, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import useLanguageStore from '@hooks/stores/languages'

import { IngredientStackParamList } from '../../../../types'
import { PageHeader } from '@components/Themed'

export default function Ingredient(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const language = useLanguageStore((state) => state.languages[props.route.params.id])
  const [
    registerIds,
    unregisterIds,
    getLanguageById,
    updateLanguage,
  ] = useLanguageStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getLanguageById,
    state.updateLanguage,
  ])

  useEffect(() => {
    if (!language) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getLanguageById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Language</PageHeader>
      <Card>
        {isLoading && !language && <ActivityIndicator />}
        {language && (
          <View>
            <FieldWithLabel
              label="Name"
              value={language.name}
              onChangeValue={(val) => updateLanguage(language.id, { name: val })}
            />
          </View>
        )}
      </Card>
    </ScrollView>
  )
}
