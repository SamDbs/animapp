import { ActivityIndicator, Image, ScrollView, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'

import Card from '@components/Card'
import FieldWithLabel from '@components/FieldWithLabel'
import FieldTranslatable from '@components/FieldTranslatable'
import useProductsStore, { Product as ProductEntity } from '@hooks/stores/product'
import useProductTranslationStore, {
  ProductTranslation,
  ProductTranslationStore,
} from '@hooks/stores/product-translation'

import { ProductStackParamList } from '../../../../types'

export default function Product(props: StackScreenProps<ProductStackParamList, 'Product'>) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const product = useProductsStore((state) => state.products[props.route.params.id])
  const [registerIds, unregisterIds, getProductById, updateProduct] = useProductsStore((state) => [
    state.registerIds,
    state.unregisterIds,
    state.getProductById,
    state.updateProduct,
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
    <ScrollView style={{ padding: 16 }}>
      <Card>
        {isLoading && !product && <ActivityIndicator />}
        {product && (
          <>
            <View
              style={{
                height: 400,
                width: 400,
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://cdn.stocksnap.io/img-thumbs/960w/vintage-red_8QKIFL9ZUI.jpg',
                }}
                style={{
                  height: 400 - 20,
                  width: 400 - 20,
                  margin: 20 / 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View>
              <FieldWithLabel
                label="Name"
                value={product.name}
                onChangeValue={(val) => updateProduct(product.id, { name: val })}
              />
              <FieldWithLabel
                label="Type"
                value={product.type}
                onChangeValue={(val) => updateProduct(product.id, { type: val })}
              />
              <FieldWithLabel
                label="Bar code"
                value={product.barCode}
                onChangeValue={(val) => updateProduct(product.id, { barCode: val })}
              />
              <FieldTranslatable<ProductEntity, ProductTranslation, ProductTranslationStore>
                fields={{ description: 'Description' }}
                baseEntityId={product.id}
                useStore={useProductTranslationStore}
                translationGetterSelector={(state) => state.getProductTranslations}
                translationUpdaterSelector={(state) => state.updateProductTranslation}
                translationsSelectorCreator={(ids) => (state) =>
                  ids.map((id) => state.productTranslations[id])}
              />
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  )
}
