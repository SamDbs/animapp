import { gql, useMutation } from '@apollo/client'
import Card from '@components/Card'
import FieldSelectWithLabel from '@components/FieldSelectWithlabel'
import FieldWithLabel from '@components/FieldWithLabel'
import { ProductType } from '@hooks/stores/product'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'

import ProductBrand from './ProductBrand'
import ProductBrandSelector from './ProductBrandSelector'
import { GET_PRODUCTS } from './ProductsList'

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $brandId: String!, $barCode: String!, $type: String!) {
    createProduct(name: $name, brandId: $brandId, barCode: $barCode, type: $type) {
      id
      name
      brandId
    }
  }
`
type MutationReturnType = { createProduct: { id: string; name: string; brandId: string } }
type MutationVariables = { name: string; brandId: string; barCode: string; type: string }

const initialState: MutationVariables = {
  type: ProductType.DRY_FOOD,
  name: '',
  barCode: '',
  brandId: '',
}

export default function ProductCreator({ style }: { style?: View['props']['style'] }) {
  const [createProduct, { loading }] = useMutation<MutationReturnType, MutationVariables>(
    CREATE_PRODUCT,
    { refetchQueries: [GET_PRODUCTS] },
  )
  const [product, setProduct] = useState<MutationVariables>(initialState)
  const [error, setError] = useState('')
  const navigation = useNavigation()

  const create = async () => {
    try {
      const { data, errors } = await createProduct({ variables: product })
      if (errors?.length) setError(errors[0].message)
      else
        navigation.navigate('ProductStack', {
          screen: 'Product',
          params: { id: data?.createProduct.id },
        })
      setError('')
    } catch (e: any) {
      setError(e?.networkError?.result?.errors?.[0]?.message ?? 'Error !')
    }
  }

  return (
    <Card style={style}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Create a product</Text>
      <Text>{product.brandId ? 'Brand' : 'Select a brand'}</Text>
      <ProductBrand
        id={product.brandId}
        onRemove={() => setProduct((state) => ({ ...state, brandId: '' }))}
      />
      {!product.brandId && (
        <ProductBrandSelector
          onSelect={(brandId) => setProduct((state) => ({ ...state, brandId }))}
        />
      )}
      <View style={{ marginBottom: 16 }} />
      <FieldWithLabel
        label="Name"
        value={product.name}
        onChangeValue={(val) => setProduct((current) => ({ ...current, name: val }))}
      />
      <FieldSelectWithLabel
        label="Type"
        onChangeValue={(val) => setProduct((current) => ({ ...current, type: val }))}
        options={Object.keys(ProductType) as ProductType[]}
        translationKey="ProductType"
        value={product.type as ProductType}
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
