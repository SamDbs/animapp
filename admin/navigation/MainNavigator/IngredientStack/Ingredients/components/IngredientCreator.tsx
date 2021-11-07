import Card from '@components/Card'
import useCreateIngredient from '@hooks/queries/CreateIngredient'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

export default function IngredientCreator({ style }: any) {
  const [createIngredient, { loading }] = useCreateIngredient()
  const navigation = useNavigation()
  const [error, setError] = useState('')
  const create = async () => {
    setError('')
    try {
      const { data } = await createIngredient()
      navigation.navigate('IngredientStack', {
        screen: 'Ingredient',
        params: { id: data?.createIngredient.id },
      })
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
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
