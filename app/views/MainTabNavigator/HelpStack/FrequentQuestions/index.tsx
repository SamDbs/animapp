import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useState } from 'react'

import { SafeAreaPage } from '../../../components/Themed'
import useGetFaqs from '../../../../hooks/queries/GetFaq'
import FaqItem from './components/FaqItem'
import { RootStackParamList } from '../../../../types'

type Props = StackScreenProps<RootStackParamList, 'Faq'>

export default function FrequentQuestions(props: Props): JSX.Element {
  const { data, loading } = useGetFaqs()
  const [openItem, setOpenItem] = useState<string | null>(null)

  const faqs = data?.faqs ?? []
  return (
    <SafeAreaPage noContext>
      <View style={style.marginTop} />
      {loading && <ActivityIndicator size={40} color="#ccc" />}
      {faqs &&
        faqs.map((item) => (
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
