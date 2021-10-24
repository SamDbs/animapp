import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import React, { useState } from 'react'
import { Button, Text } from 'react-native'
import { GET_BRANDS } from './BrandList'

const initialState = { name: '' }

const CREATE_BRAND = gql`
  mutation CreateBrand($name: String!) {
    createBrand(name: $name) {
      id
      name
    }
  }
`

export default function BrandCreator({ style }: any) {
  const [brand, setBrand] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createBrand] = useMutation(CREATE_BRAND, {
    refetchQueries: [GET_BRANDS],
  })

  const create = async () => {
    setLoading(true)
    setError('')
    try {
      await createBrand({ variables: { name: brand.name } })
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
