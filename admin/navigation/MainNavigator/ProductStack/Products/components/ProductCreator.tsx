import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import useProductsStore from '@hooks/stores/product'
import useBrandStore from '@hooks/stores/brand'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

const initialState = { type: '', name: '', barCode: '', brandId: '' }

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
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a product</Text>
      <FieldWithLabel
        label="Brand"
        value={product.brandId.toString()}
        onChangeValue={(val) => setProduct((current) => ({ ...current, name: val }))}
      />
      <FieldWithLabel
        label="Name"
        value={product.name}
        onChangeValue={(val) => setProduct((current) => ({ ...current, name: val }))}
      />
      <FieldWithLabel
        label="Type"
        value={product.type}
        onChangeValue={(val) => setProduct((current) => ({ ...current, type: val }))}
      />
      <FieldWithLabel
        label="Bar code"
        value={product.barCode}
        onChangeValue={(val) => setProduct((current) => ({ ...current, barCode: val }))}
      />
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
