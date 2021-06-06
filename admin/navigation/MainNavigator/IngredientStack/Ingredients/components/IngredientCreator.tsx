import { Button, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

import useIngredientsStore from '@hooks/stores/ingredient'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'


export default function IngredientCreator({ style }: any) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createIngredient = useIngredientsStore((state) => state.createIngredient)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createIngredient()
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create an ingredient</Text>
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
