import Card from '@components/Card'
import useFaqStore from '@hooks/stores/faq'
import { Link } from '@react-navigation/native'
import { debounce } from 'lodash/fp'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View, ActivityIndicator } from 'react-native'

export default function FaqList({ style }: { style: View['props']['style'] }) {
  const [ids, setFaqIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds, getFaqs, searchFaqs] = useFaqStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getFaqs,
    state.searchFaqs,
  ])
  const faqs = useFaqStore(useCallback((state) => ids.map((id) => state.faqs[id]), [ids]))

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchFaqs(text)
      setFaqIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getFaqs()
      setFaqIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !faqs.length

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18 }}>Faq list</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingVertical: 0,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 8 }}>Search</Text>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              height: 30,
              paddingHorizontal: 8,
            }}
            onChangeText={searchDebounced}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        {isLoading && <ActivityIndicator style={{ margin: 8 }} />}
        {noResult && (
          <View style={{ padding: 8 }}>
            <Text>No result.</Text>
          </View>
        )}
        {faqs.filter(Boolean).map((faq, i: number) => {
          return (
            <View
              key={faq.id}
              style={{
                padding: 8,
                borderBottomColor: '#ccc',
                borderBottomWidth: i === faqs.length - 1 ? 0 : 1,
                backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text>{faq.question}</Text>
              <Text>{faq.answer}</Text>
              <Link to={`/faq/${faq.id}`}>
                <Text style={{ cursor: 'pointer' }}>edit</Text>
              </Link>
            </View>
          )
        })}
      </View>
    </Card>
  )
}
