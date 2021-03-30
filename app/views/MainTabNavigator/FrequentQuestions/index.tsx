import React from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'

import FaqItem, { FaqItemType } from './components/FaqItem'

export default function FrequentQuestions(): JSX.Element {
  const { data: faqs, error } = useSWR(`/faq`)
  const isLoading = !faqs && !error
  return (
    <SafeAreaView>
      {isLoading && <ActivityIndicator size={40} color="#ccc" />}
      {error && <ActivityIndicator size={40} color="#ccc" />}
      {faqs && faqs.map((item: FaqItemType) => <FaqItem key={item.id} item={item} />)}
    </SafeAreaView>
  )
}
