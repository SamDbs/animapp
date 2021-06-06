import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import useBrandStore from '@hooks/stores/brand'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'

const initialState = { name: '' }

export default function BrandCreator({ style }: any) {
  const [brand, setBrand] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createBrand = useBrandStore((state) => state.createBrand)
  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createBrand(brand)
      setBrand({ ...initialState })
    } catch (e) {
      setError(e?.response?.data?.message ?? 'An unknown error occured.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a brand</Text>
      <FieldWithLabel
        label="Name"
        value={brand.name}
        onChangeValue={(val) => setBrand((current) => ({ ...current, name: val }))}
      />
      {!!error && (
        <Text style={{ backgroundColor: '#f55', padding: 8, marginBottom: 16 }}>{error}</Text>
      )}
      <Button title={loading ? 'Loading...' : 'Create'} onPress={create} disabled={loading} />
    </Card>
  )
}
