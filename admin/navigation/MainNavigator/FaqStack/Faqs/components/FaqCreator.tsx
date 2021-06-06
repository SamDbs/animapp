import Card from '@components/Card'
import useFaqStore from '@hooks/stores/faq'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

export default function FaqCreator({ style }: any) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createFaq = useFaqStore((state) => state.createFaq)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createFaq()
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
