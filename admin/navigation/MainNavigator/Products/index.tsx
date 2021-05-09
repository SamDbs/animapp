import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

import { getProducts } from '../../../features/products/actions'
import { useDispatch, useSelector } from '../../../hooks/redux'

import ProductsList from './components/ProductsList'
import ProductCreator from './components/ProductCreator'

function Header() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 22 }}>Products dashboard</Text>
    </View>
  )
}

export default function Products() {
  const dispatch = useDispatch()
  const products = useSelector((state) =>
    state.products.ids.map((id) => state.products.entities[id]),
  )
  const isLoading = useSelector((state) => state.products.isLoading)

  useEffect(() => {
    dispatch(getProducts())
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Header />
      <ProductsList isLoading={isLoading} products={products} style={{ marginBottom: 16 }} />
      <ProductCreator />
    </View>
  )
}
