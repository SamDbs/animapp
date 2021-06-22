import Card from '@components/Card'
import FieldTranslatable from '@components/FieldTranslatable'
import FieldWithLabel from '@components/FieldWithLabel'
import ManyToMany from '@components/ManyToMany'
import OneToMany from '@components/OneToMany'
import Pagination from '@components/Pagination'
import { PageHeader } from '@components/Themed'
import UploadSingleImage from '@components/UploadSingleImage'
import useBrandStore, { Brand, BrandStore } from '@hooks/stores/brand'
import useConstituentsStore from '@hooks/stores/constituent'
import useIngredientStore from '@hooks/stores/ingredient'
import useProductsStore, { Product as ProductEntity, ProductStore } from '@hooks/stores/product'
import useProductTranslationStore, {
  ProductTranslation,
  ProductTranslationStore,
} from '@hooks/stores/productTranslation'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Switch, Text, View } from 'react-native'

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
                  uri: product.image,
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
              <OneToMany<Brand, BrandStore, ProductEntity, ProductStore>
                getOwnerByOwnedIdSelect={(state) => state.getBrandByProductId}
                ownedId={product.id}
                ownerEntityLinkCreator={(brand) => `/brands/${brand.id}`}
                ownerSelectorCreator={(id) => (state) => state.brands[id]}
                ownersSelectorCreator={(ids) => (state) => ids.map((id) => state.brands[id])}
                registerOwnerIdsSelector={(state) => state.registerIds}
                searchOwnersSelector={(state) => state.searchBrands}
                unregisterOwnerIdsSelector={(state) => state.unregisterIds}
                updateOwnerInOwnedSelector={(state) => state.updateProductBrand}
                useOwnedStore={useProductsStore}
                useOwnerStore={useBrandStore}
              />
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                <Text>Published</Text>
                <Switch
                  style={{ marginLeft: 16 }}
                  value={product.published}
                  onValueChange={(value) => updateProduct(product.id, { published: value })}
                />
              </View>
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
            relationParams
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
