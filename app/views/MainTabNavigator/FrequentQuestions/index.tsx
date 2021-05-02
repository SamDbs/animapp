import { ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import useSWR from 'swr'

import { SafeAreaPage, Title } from '../../components/Themed'

import FaqItem, { FaqItemType } from './components/FaqItem'

export default function FrequentQuestions(): JSX.Element {
  const { data: faqs, error } = useSWR(`/faq`)
  const isLoading = !faqs && !error
  const [openItem, setOpenItem] = useState<number | null>(null)

  return (
    <SafeAreaPage>
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
    </SafeAreaPage>
  )
}
