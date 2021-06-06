import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import { PageHeader } from '@components/Themed'
import useFaqStore, { Faq as FaqEntity } from '@hooks/stores/faq'
import useFaqTranslationStore, {
  FaqTranslation,
  FaqTranslationStore,
} from '@hooks/stores/faqTranslation'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, View } from 'react-native'

import { FaqStackParamList } from '../../../../types'

export default function Faq(props: StackScreenProps<FaqStackParamList, 'Faq'>) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const faq = useFaqStore((state) => state.faqs[props.route.params.id])
  const [registerIds, unregisterIds, getFaqById] = useFaqStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getFaqById,
  ])

  useEffect(() => {
    if (!faq) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getFaqById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Question &amp; Answer</PageHeader>
      <Card>
        {isLoading && !faq && <ActivityIndicator />}
        {faq && (
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
              <FieldTranslatable<FaqEntity, FaqTranslation, FaqTranslationStore>
                fields={{ question: 'Question', answer: 'Answer' }}
                baseEntityId={faq.id}
                useStore={useFaqTranslationStore}
                translationGetterSelector={(state) => state.getFaqTranslations}
                translationUpdaterSelector={(state) => state.updateFaqTranslation}
                translationsSelectorCreator={(ids) => (state) =>
                  ids.map((id) => state.faqTranslations[id])}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
