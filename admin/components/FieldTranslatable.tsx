import type { Constituent } from '@hooks/stores/constituent'
import type { ConstituentTranslation } from '@hooks/stores/constituentTranslation'
import type { Faq } from '@hooks/stores/faq'
import type { FaqTranslation } from '@hooks/stores/faqTranslation'
import type { Ingredient } from '@hooks/stores/ingredient'
import type { IngredientTranslation } from '@hooks/stores/ingredientTranslation'
import useLanguagesStore, { Language } from '@hooks/stores/languages'
import type { Product } from '@hooks/stores/product'
import type { ProductTranslation } from '@hooks/stores/productTranslation'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import type { StateSelector, UseStore } from 'zustand'

type Props<
  Item extends Product | Ingredient | Faq,
  ItemTranslation extends
    | ProductTranslation
    | IngredientTranslation
    | FaqTranslation
    | ConstituentTranslation,
  StoreShape extends object,
> = {
  baseEntityId: Item['id']
  fields: Partial<Record<keyof ItemTranslation, string>>
  translationUpdaterSelector: StateSelector<
    StoreShape,
    (
      itemId: Item['id'],
      languageId: Language['id'],
      params: Partial<ItemTranslation>,
    ) => Promise<void>
  >
  translationGetterSelector: StateSelector<
    StoreShape,
    (itemId: Item['id']) => Promise<{ ids: ItemTranslation['id'][] }>
  >
  translationsSelectorCreator: (
    ids: ItemTranslation['id'][],
  ) => StateSelector<StoreShape, Partial<ItemTranslation>[]>
  useStore: UseStore<StoreShape>
}

export default function FieldTranslatable<
  Item extends Product | Ingredient | Faq | Constituent,
  ItemTranslation extends
    | ProductTranslation
    | IngredientTranslation
    | FaqTranslation
    | ConstituentTranslation,
  StoreShape extends object,
>({
  baseEntityId,
  fields,
  translationUpdaterSelector,
  translationGetterSelector,
  translationsSelectorCreator,
  useStore,
}: Props<Item, ItemTranslation, StoreShape>) {
  const [ids, setIds] = useState<ItemTranslation['id'][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [createdTranslation, setCreatedTranslation] = useState<{
    [key: string]: Partial<ItemTranslation>
  }>({})
  const getTranslations = useStore(translationGetterSelector)
  const updateTranslation = useStore(translationUpdaterSelector)
  const translations = useStore(useCallback(translationsSelectorCreator(ids), [ids]))
  const [languages, getAllLanguages] = useLanguagesStore((state) => [
    state.languages,
    state.getAllLanguages,
  ])

  const languageIds = Object.keys(languages)

  // useEffect(() => {
  //   console.log('should register the id here')
  //   return () => console.log('should unregister here')
  // }, [ids])

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      await getAllLanguages()
      const { ids } = await getTranslations(baseEntityId)
      setIds(ids)
      setIsLoading(false)
    }
    init()
  }, [baseEntityId])

  if (isLoading) return null

  const fieldsToTranslate = Object.entries(fields) as [keyof ItemTranslation, string][]

  return (
    <View>
      <View style={{ marginBottom: 8 }}>
        <Text>Translations</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {languageIds.map((languageId, i) => {
          const language = languages[languageId]
          const translationId = `${baseEntityId}-${languageId}`
          const currentTranslation = translations.find(
            (translation) => translation.id === translationId,
          )
          return (
            <View
              key={languageId}
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
                <Text style={{ marginVertical: 8, fontWeight: 'bold' }}>{language.name}</Text>
                {fieldsToTranslate.map(([field, label]) => {
                  return (
                    <View key={field} style={{ paddingVertical: 8 }}>
                      <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row' }}>
                        <View style={{ width: 100 }}>
                          <Text>{label}</Text>
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
                            const newValue = {
                              ...createdTranslation,
                              [translationId]: {
                                ...createdTranslation[translationId],
                                [field]: text,
                              },
                            }
                            setCreatedTranslation(newValue)
                            if (
                              Object.keys(newValue[translationId]).length !==
                                fieldsToTranslate.length &&
                              !currentTranslation
                            ) {
                              return
                            }
                            updateTranslation(
                              baseEntityId,
                              language.id,
                              newValue[translationId] as unknown as Partial<ItemTranslation>,
                            )
                          }}
                          defaultValue={currentTranslation ? currentTranslation[field] : ''}
                        />
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}
