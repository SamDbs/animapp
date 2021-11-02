import { gql, useMutation, useQuery } from '@apollo/client'
import Card from '@components/Card'
import FieldSelectWithLabel from '@components/FieldSelectWithlabel'
import FieldTranslatableQL, { EntityKind } from '@components/FieldTransatableQL'
import FieldWithLabel from '@components/FieldWithLabel'
import { PageHeader } from '@components/Themed'
import UploadSingleImage from '@components/UploadSingleImage'
import useProductsStore, { ProductType } from '@hooks/stores/product'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Switch, Text, View } from 'react-native'

import { ProductStackParamList } from '../../../../types'
import ProductBrand from '../Products/components/ProductBrand'
import ProductBrandSelector from '../Products/components/ProductBrandSelector'
import ProductIngredients from './components/ProductIngredients'

type Product = {
  barCode: string
  brandId: string
  id: string
  image: string
  name: string
  published: boolean
  translations: {
    description: string
    languageId: string
  }[]
  type: string
}
type Variables = {
  id?: string
  name?: string
  barCode?: string
  type?: ProductType
  published?: boolean
  brandId?: string
}

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      barCode
      brandId
      id
      image
      name
      published
      translations {
        description
        languageId
      }
      type
    }
  }
`

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: String!
    $name: String
    $barCode: String
    $type: String
    $published: Boolean
    $brandId: String
  ) {
    updateProduct(
      id: $id
      barCode: $barCode
      name: $name
      type: $type
      published: $published
      brandId: $brandId
    ) {
      id
      published
      brandId
    }
  }
`

const fieldsToTranslate = ['description']

export default function ProductComponent(
  props: StackScreenProps<ProductStackParamList, 'Product'>,
) {
  const { data, loading } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id: props.route.params.id },
  })
  const [updateProduct] = useMutation<{ updateProduct: { id: string } }, Variables>(
    UPDATE_PRODUCT,
    {
      variables: { id: props.route.params.id },
    },
  )

  const [editBrand, setEditBrand] = useState(false)

  const product = data?.product

  return (
    <ScrollView style={{ padding: 16 }}>
      <PageHeader>Product</PageHeader>
      <Card>
        <Text style={{ fontSize: 18 }}>Product</Text>
        {loading && <ActivityIndicator />}
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
              <ProductBrand id={product.brandId} onRemove={() => setEditBrand(true)} />
              {editBrand && (
                <ProductBrandSelector
                  onSelect={(brandId) => {
                    updateProduct({ variables: { brandId } })
                    setEditBrand(false)
                  }}
                />
              )}
              <FieldWithLabel
                label="Name"
                value={product.name}
                onChangeValue={(val) => updateProduct({ variables: { name: val } })}
              />
              <FieldSelectWithLabel
                label="Type"
                onChangeValue={(val) => updateProduct({ variables: { type: val } })}
                options={Object.keys(ProductType) as ProductType[]}
                translationKey="ProductType"
                value={product.type}
              />
              <FieldWithLabel
                label="Bar code"
                value={product.barCode}
                onChangeValue={(val) => updateProduct({ variables: { barCode: val } })}
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
                  onValueChange={(value) => updateProduct({ variables: { published: value } })}
                />
              </View>
              <FieldTranslatableQL
                entityId={product.id}
                fields={fieldsToTranslate}
                kind={EntityKind.product}
                translations={data.product.translations.map(({ languageId, description }) => ({
                  languageId,
                  strings: { description },
                }))}
              />
            </View>
          </>
        )}
      </Card>
      {data?.product && <ProductIngredients productId={data.product.id} />}
      {/* <Card style={{ marginVertical: 16 }}>
        <Text style={{ fontSize: 18 }}>Attached ingredients</Text>
        {isLoading && !product && <ActivityIndicator />}
        {product && (
          <ManyToMany
            useOwnedStore={useIngredientStore}
            ownerEntityId={product.id}
            ownedItemsGetterSelector={(state) => state.getIngredientsByProductId}
            ownedItemsUpdaterSelector={(state) => state.updateIngredientsByProductId}
            relationParams
            ownedItemsDeletorSelector={(state) => state.deleteIngredientFromProductId}
            ownedItemsSelectorCreator={(ids) => (state) =>
              ids
                .map((id) => state.ingredients[id])
                .sort((a, b) => {
                  return (state?.productIngredients[`${product.id}-${a.id}`]?.order ?? 0) >
                    (state?.productIngredients[`${product.id}-${b.id}`]?.order ?? 0)
                    ? 1
                    : -1
                })}
            registerOwnedIdsSelector={(state) => state.registerIds}
            unregisterOwnedIdsSelector={(state) => state.unregisterIds}
            searchItemsSelector={(state) => state.searchIngredients}
            ownedEntityLinkCreator={(item) => `/ingredients/${item.id}`}
            ownedItemsRelationGetterSelector={(state) => state.productIngredients}
            withOrder
            setOrderSelector={(state) => state.setIngredientsOrder}
          />
        )}
      </Card> */}
      {/* <Card style={{ marginVertical: 16 }}>
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
            searchItemsSelector={(state) => state.searchConstituents}
            ownedEntityLinkCreator={(item) => `/constituents/${item.id}`}
            ownedItemsRelationGetterSelector={(state) => state.productConstituents}
          />
        )}
      </Card> */}
    </ScrollView>
  )
}
