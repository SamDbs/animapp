import { Button, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

import useConstituentsStore from '@hooks/stores/constituent'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'


export default function ConstituentCreator({ style }: any) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createConstituent = useConstituentsStore((state) => state.createConstituent)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createConstituent()
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create an analytical constituent</Text>
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
