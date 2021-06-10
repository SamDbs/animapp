import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import FieldWithLabel from '@components/FieldWithLabel'
import ManyToMany from '@components/ManyToMany'
import { PageHeader } from '@components/Themed'
import useIngredientStore, {
  Ingredient as IngredientEntity,
  IngredientStore,
} from '@hooks/stores/ingredient'
import useConstituentStore, {
  Constituent as ConstituentEntity,
  ConstituentStoreState,
} from '@hooks/stores/constituent'
import useProductsStore, { Product as ProductEntity } from '@hooks/stores/product'
import useProductTranslationStore, {
  ProductTranslation,
  ProductTranslationStore,
} from '@hooks/stores/productTranslation'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'

import { ProductStackParamList } from '../../../../types'
import useConstituentsStore from '@hooks/stores/constituent'

export default function Product(props: StackScreenProps<ProductStackParamList, 'Product'>) {
  const [id, setId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [product, registerIds, unregisterIds, getProductById, updateProduct] = useProductsStore(
    (state) => [
      state.products[props.route.params.id],
      state.registerIds,
      state.unregisterIds,
      state.getProductById,
      state.updateProduct,
    ],
  )

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
      <PageHeader>Product</PageHeader>
      <Card>
        <Text style={{ fontSize: 18 }}>Product</Text>
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
      <Card style={{ marginVertical: 16 }}>
        <Text style={{ fontSize: 18 }}>Attached ingredients</Text>
        {isLoading && !product && <ActivityIndicator />}
        {product && (
          <ManyToMany<ProductEntity, IngredientEntity, IngredientStore>
            useOwnedStore={useIngredientStore}
            ownerEntityId={product.id}
            ownedItemsGetterSelector={(state) => state.getIngredientsByProductId}
            ownedItemsUpdaterSelector={(state) => state.updateIngredientsByProductId}
            ownedItemsSelectorCreator={(ids) => (state) => ids.map((id) => state.ingredients[id])}
            registerOwnedIdsSelector={(state) => state.registerIds}
            unregisterOwnedIdsSelector={(state) => state.unregisterIds}
            getItemsSelector={(state) => state.getIngredients}
            searchItemsSelector={(state) => state.searchIngredients}
            ownedEntityLinkCreator={(item) => `/ingredients/${item.id}`}
          />
        )}
      </Card>
      <Card style={{ marginVertical: 16 }}>
        <Text style={{ fontSize: 18 }}>Attached Analytical Constituent</Text>
        {isLoading && !product && <ActivityIndicator />}
        {product && (
          <ManyToMany<ProductEntity, ConstituentEntity, ConstituentStoreState >
            useOwnedStore={useConstituentsStore}
            ownerEntityId={product.id}
            ownedItemsGetterSelector={(state) => state.getConstituentsByProductId}
            ownedItemsUpdaterSelector={(state) => state.updateConstituentsByProductId}
            ownedItemsSelectorCreator={(ids) => (state) => ids.map((id) => state.constituents[id])}
            registerOwnedIdsSelector={(state) => state.registerIds}
            unregisterOwnedIdsSelector={(state) => state.unregisterIds}
            getItemsSelector={(state) => state.getConstituents}
            searchItemsSelector={(state) => state.searchConstituents}
            ownedEntityLinkCreator={(item) => `/analyticalConstituents/${item.id}`}
          />
        )}
      </Card>
    </ScrollView>
  )
}
