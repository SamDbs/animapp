import React, { useState } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useSWR from 'swr'

import FaqItem, { FaqItemType } from './components/FaqItem'

export function Title(props: JSX.Element['props']) {
  return <Text style={{ fontSize: 20, margin: 10 }}>{props.children}</Text>
}

export default function FrequentQuestions(): JSX.Element {
  const { data: faqs, error } = useSWR(`/faq`)
  const isLoading = !faqs && !error
  const [openItem, setOpenItem] = useState<number | null>(null)

  return (
    <SafeAreaView>
      <Title>FAQ</Title>
      {isLoading && <ActivityIndicator size={40} color="#ccc" />}
      {error && <ActivityIndicator size={40} color="#ccc" />}
      {faqs &&
        faqs.map((item: FaqItemType) => (
          <FaqItem
            key={item.id}
            item={item}
            isOpen={item.id === openItem}
            toggle={() => {
              setOpenItem(openItem === item.id ? null : item.id)
            }}
          />
        ))}
    </SafeAreaView>
  )
}
