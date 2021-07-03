import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import useSWR from 'swr'

import { SafeAreaPage } from '../../../components/Themed'

import FaqItem, { FaqItemType } from './components/FaqItem'

export default function FrequentQuestions(): JSX.Element {
  const { data, error } = useSWR(`/faq`)
  const isLoading = !data?.faqs && !error
  const [openItem, setOpenItem] = useState<number | null>(null)

  const faqs = data?.faqs ?? []

  return (
    <SafeAreaPage noContext>
      <View style={style.marginTop} />
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

const style = StyleSheet.create({ marginTop: { height: 5 } })
