import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { ProductStackParamList } from 'types'

import Card from '@components/Card'
import { useProductsStore } from '@hooks/stores'

export default function Product(props: StackScreenProps<ProductStackParamList, 'Product'>) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const product = useProductsStore((state) => state.products[props.route.params.id])
  const [registerIds, unregisterIds, getProductById] = useProductsStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getProductById,
  ])

  useEffect(() => {
    if (!product) return
    registerIds([id])
    return () => unregisterIds([id])
  }, [id])

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { id } = await getProductById(props.route.params.id)
      setId(id)
      setIsLoading(false)
    }
    fn()
  }, [])

  return (
    <View style={{ padding: 16 }}>
      <Card>
        {isLoading && !product && <ActivityIndicator />}
        {product && <Text>{product.name}</Text>}
      </Card>
    </View>
  )
}
