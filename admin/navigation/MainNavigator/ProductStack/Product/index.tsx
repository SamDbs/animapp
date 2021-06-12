import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import FieldWithLabel from '@components/FieldWithLabel'
import ManyToMany from '@components/ManyToMany'
import { PageHeader } from '@components/Themed'
import UploadSingleImage from '@components/UploadSingleImage'
import useConstituentsStore from '@hooks/stores/constituent'
import useIngredientStore from '@hooks/stores/ingredient'
import useProductsStore, { Product as ProductEntity } from '@hooks/stores/product'
import useProductTranslationStore, {
  ProductTranslation,
  ProductTranslationStore,
} from '@hooks/stores/productTranslation'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'

import { ProductStackParamList } from '../../../../types'

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
                height: 450,
                width: 400,
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: product.image || 'http://placekitten.com/400/400',
                }}
                style={{
                  height: 400 - 20,
                  width: 400 - 20,
                  margin: 20 / 2,
                  borderRadius: 5,
                  overflow: 'hidden',
                  resizeMode: 'contain',
                  opacity: product.image ? 1 : 0.6,
                }}
              />
              <UploadSingleImage
                useOwnerStore={useProductsStore}
                ownerId={product.id}
                updateItemImageSelector={(store) => store.locallySetProductImage}
                uploadLinkCreator={(productId) => `/products/${productId}/image`}
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
          <ManyToMany
            useOwnedStore={useIngredientStore}
            ownerEntityId={product.id}
            ownedItemsGetterSelector={(state) => state.getIngredientsByProductId}
            ownedItemsUpdaterSelector={(state) => state.updateIngredientsByProductId}
            ownedItemsDeletorSelector={(state) => state.deleteIngredientFromProductId}
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
          <ManyToMany
            useOwnedStore={useConstituentsStore}
            ownerEntityId={product.id}
            ownedItemsGetterSelector={(state) => state.getConstituentsByProductId}
            ownedItemsUpdaterSelector={(state) => state.updateConstituentsByProductId}
            ownedItemsDeletorSelector={(state) => state.deleteConstituentFromProductId}
            ownedItemsSelectorCreator={(ids) => (state) => ids.map((id) => state.constituents[id])}
            registerOwnedIdsSelector={(state) => state.registerIds}
            unregisterOwnedIdsSelector={(state) => state.unregisterIds}
            getItemsSelector={(state) => state.getConstituents}
            searchItemsSelector={(state) => state.searchConstituents}
            ownedEntityLinkCreator={(item) => `/constituents/${item.id}`}
          />
        )}
      </Card>
    </ScrollView>
  )
}
