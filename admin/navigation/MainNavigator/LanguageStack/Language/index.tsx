import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import useLanguageStore from '@hooks/stores/languages'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'

import { IngredientStackParamList } from '../../../../types'

export default function LanguageComponent(
  props: StackScreenProps<IngredientStackParamList, 'Ingredient'>,
) {
  const [isLoading, setIsLoading] = useState(false)
  const language = useLanguageStore((state) => state.languages[props.route.params.id])
  const [getLanguageById, updateLanguage] = useLanguageStore((state) => [
    state.getLanguageById,
    state.updateLanguage,
  ])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      await getLanguageById(props.route.params.id)
      setIsLoading(false)
    }
    fn()
  }, [props.route.params.id])

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
