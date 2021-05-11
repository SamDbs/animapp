import { Button, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

import { useProductsStore } from '@hooks/stores'
import Card from '@components/Card'

function Row({
  label,
  onChangeValue,
  value,
}: {
  label: string
  onChangeValue: any
  value: string
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ marginBottom: 8 }}>{label}</Text>
      <TextInput
        style={{ padding: 8, borderColor: '#ccc', borderWidth: 1, borderRadius: 3 }}
        onChangeText={onChangeValue}
        value={value}
      />
    </View>
  )
}

const initialState = { type: '', name: '', barCode: '', brandId: 3 }

export default function ProductCreator({ style }: any) {
  const [product, setProduct] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createProduct = useProductsStore((state) => state.createProduct)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createProduct(product)
      setProduct({ ...initialState })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a product</Text>
      <Row
        label="Type"
        value={product.type}
        onChangeValue={(val: string) => setProduct((current) => ({ ...current, type: val }))}
      />
      <Row
        label="Name"
        value={product.name}
        onChangeValue={(val: string) => setProduct((current) => ({ ...current, name: val }))}
      />
      <Row
        label="Bar code"
        value={product.barCode}
        onChangeValue={(val: string) => setProduct((current) => ({ ...current, barCode: val }))}
      />
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
