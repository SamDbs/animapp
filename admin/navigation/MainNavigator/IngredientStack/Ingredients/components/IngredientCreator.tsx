import Card from '@components/Card'
import useIngredientsStore from '@hooks/stores/ingredient'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

export default function IngredientCreator({ style }: any) {
  const navigation = useNavigation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createIngredient = useIngredientsStore((state) => state.createIngredient)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      const id = await createIngredient()
      navigation.navigate('IngredientStack', { screen: 'Ingredient', params: { id } })
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
