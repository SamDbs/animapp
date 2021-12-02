import Card from '@components/Card'
import useCreateConstituent from '@hooks/queries/CreateConstituent'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

export default function ConstituentCreator({ style }: any) {
  const [createConstituent, { loading }] = useCreateConstituent()
  const navigation = useNavigation()
  const [error, setError] = useState('')
  const create = async () => {
    setError('')
    try {
      const { data } = await createConstituent()
      navigation.navigate('ConstituentStack', {
        screen: 'Constituent',
        params: { id: data?.createConstituent.id },
      })
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
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
