import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'

import { Product } from '@hooks/stores'
import { UseStore } from 'zustand'

const statusColor = {
  default: '#ccc',
  loading: 'orange',
  saved: 'green',
}

type Props<T extends Product> = {
  baseEntityId: T['id']
  field: keyof T
  label: string
  status?: keyof typeof statusColor
  translationUpdaterSelector: (state: any) => any
  translationGetterSelector: (state: any) => any
  translationsSelectorCreator: (ids: any) => any
  useStore: any
}

export default function FieldTranslatable<T extends Product>({
  baseEntityId,
  field,
  label,
  status = 'default',
  translationUpdaterSelector,
  translationGetterSelector,
  translationsSelectorCreator,
  useStore,
}: Props<T>) {
  const [ids, setIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const getTranslations = useStore(translationGetterSelector)
  const updateTranslation = useStore(translationUpdaterSelector)
  const translations = useStore(useCallback(translationsSelectorCreator(ids), [ids]))

  useEffect(() => {
    console.log('should register the id here')
    return () => console.log('should unregister here')
  }, [ids])

  useEffect(() => {
    async function fetchTranslations() {
      setIsLoading(true)
      const { ids } = await getTranslations(baseEntityId)
      setIds(ids)
      setIsLoading(false)
    }
    fetchTranslations()
  }, [])

  if (isLoading) return null

  return (
    <View style={{ marginBottom: 16, flex: 1 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      {translations.map((translation: any) => {
        return (
          <View
            key={translation.id}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 100 }}>
              <Text>{translation.languageId}</Text>
            </View>
            <TextInput
              style={{
                padding: 8,
                borderColor: statusColor[status],
                borderWidth: 1,
                borderRadius: 3,
              }}
              onChangeText={(text) =>
                updateTranslation(baseEntityId, translation.languageId, field, text)
              }
              value={translation[field]}
            />
          </View>
        )
      })}
    </View>
  )
}
