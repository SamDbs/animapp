import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import OneToMany from '@components/OneToMany'
import useBrandStore, { Brand, BrandStore } from '@hooks/stores/brand'
import useProductsStore, { Product, ProductStore } from '@hooks/stores/product'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native'

import SubItem from '@components/SubItem'

const initialState = { type: '', name: '', barCode: '', brandId: '' }

export default function ProductCreator({ style }: any) {
  const [product, setProduct] = useState({ ...initialState })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const createProduct = useProductsStore((state) => state.createProduct)
  const [brands, registerBrandIds, unregisterBrandIds] = useBrandStore((state) => [
    state.brands,
    state.registerIds,
    state.unregisterIds,
  ])

  useEffect(() => {
    if (!product.brandId) return
    registerBrandIds([product.brandId])
    return () => unregisterBrandIds([product.brandId])
  }, [product.brandId])

  const brand = brands[product.brandId]

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
      {brand && (
        <View
          style={{
            marginTop: 16,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
          <SubItem<Brand> even entityLinkCreator={(id) => 'osef'} item={brand} />
        </View>
      )}
      <OneToMany<Brand, BrandStore, Product, ProductStore>
        getOwnerByOwnedIdSelect={(state) => state.getBrandByProductId}
        getOwnersSelector={(state) => state.getBrands}
        ownerEntityLinkCreator={(brand) => `/brands/${brand.id}`}
        ownerSelectorCreator={(id) => (state) => state.brands[id]}
        ownersSelectorCreator={(ids) => (state) => ids.map((id) => state.brands[id])}
        registerOwnerIdsSelector={(state) => state.registerIds}
        searchOwnersSelector={(state) => state.searchBrands}
        setOwnerId={(brandId) => setProduct((state) => ({ ...state, brandId }))}
        unregisterOwnerIdsSelector={(state) => state.unregisterIds}
        updateOwnerInOwnedSelector={(state) => state.updateProductBrand}
        useOwnedStore={useProductsStore}
        useOwnerStore={useBrandStore}
      />
      <View style={{ marginBottom: 16 }} />
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
