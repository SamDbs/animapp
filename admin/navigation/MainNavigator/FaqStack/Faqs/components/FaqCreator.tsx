import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

import { GET_FAQS } from './FaqList'

const CREATE_FAQ = gql`
  mutation CreateFaq {
    createFaq {
      id
    }
  }
`

export default function FaqCreator({ style }: any) {
  const navigation = useNavigation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createFaq] = useMutation<{ createFaq: { id: string } }>(CREATE_FAQ, {
    refetchQueries: [GET_FAQS],
  })

  const create = async () => {
    setLoading(true)
    setError('')
    try {
      const x = await createFaq()
      navigation.navigate('FaqStack', { screen: 'Faq', params: { id: x.data?.createFaq.id } })
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a Question/Answer</Text>
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
