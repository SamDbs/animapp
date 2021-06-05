import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import FieldTranslatable from '@components/FieldTranslatable'
import useConstituentsStore, { Constituent as ConstituentEntity } from '@hooks/stores/constituent'

import { ConstituentStackParamList } from '../../../../types'
import useConstituentTranslationStore, {
  ConstituentTranslation,
  ConstituentTranslationStore,
} from '@hooks/stores/constituentTranslation'

export default function Constituent(
  props: StackScreenProps<ConstituentStackParamList, 'Constituent'>,
) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const constituent = useConstituentsStore((state) => state.constituents[props.route.params.id])
  const [registerIds, unregisterIds, getConstituentById, updateConstituent] = useConstituentsStore(
    (state) => [
      state.registerIds,
      state.unregisterIds,
      state.getConstituentById,
      state.updateConstituent,
    ],
  )

  useEffect(() => {
    if (!constituent) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getConstituentById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <ScrollView style={{ padding: 16 }}>
      <Card>
        {isLoading && !constituent && <ActivityIndicator />}
        {constituent && (
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
                ConstituentEntity,
                ConstituentTranslation,
                ConstituentTranslationStore
              >
                fields={{ name: 'Name', description: 'Description' }}
                baseEntityId={constituent.id}
                useStore={useConstituentTranslationStore}
                translationGetterSelector={(state) => state.getConstituentTranslations}
                translationUpdaterSelector={(state) => state.updateConstituentTranslation}
                translationsSelectorCreator={(ids) => (state) =>
                  ids.map((id) => state.constituentTranslations[id])}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
