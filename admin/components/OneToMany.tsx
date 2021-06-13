import useSearchableList from '@hooks/useSearchableList'
import { Link } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import type { UseStore, StateSelector } from 'zustand'

import { Brand } from '@hooks/stores/brand'

export default function OneToMany({
  brandsSelectorCreator,
  getBrandsSelector,
  productId,
  searchBrandsSelector,
  useBrandStore,
  useProductsStore,
  registerOwnedIdsSelector,
  unregisterOwnedIdsSelector,
}) {
  const [id, setId] = useState<OwnedItem['id']>()
  const [isLoading, setIsLoading] = useState(false)

  const {
    isLoading: isLoadingOwnedItems,
    items: ownedItems,
    noResult: noResultOwnedItems,
    searchDebounced: searchOwnedItems,
  } = useSearchableList(
    useBrandStore,
    getBrandsSelector,
    searchBrandsSelector,
    brandsSelectorCreator,
  )

  const getBrandByProductId = useBrandStore((state) => state.getBrandByProductId)
  const updateProductBrand = useProductsStore((state) => state.updateProductBrand)
  const registerOwnedIds = useBrandStore(registerOwnedIdsSelector)
  const unregisterOwnedIds = useBrandStore(unregisterOwnedIdsSelector)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const { id } = await getBrandByProductId(productId)
      setId(id)
      setIsLoading(false)
    }
    if (productId) init()
  }, [productId])

  useEffect(() => {
    registerOwnedIds([id])
    return () => unregisterOwnedIds([id])
  }, [id])

  const updateOwned = async (brandId: Brand['id']) => {
    await updateProductBrand(productId, brandId)
    setId(brandId)
  }

  const brand = useBrandStore((state) => state.brands[id])

  if (isLoading || !brand) return <ActivityIndicator />

  return (
    <View>
      <Text>{brand.name}</Text>
      <View
        style={{
          marginTop: 8,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        {isLoadingOwnedItems && <ActivityIndicator />}
        {!noResultOwnedItems &&
          ownedItems
            .filter((item) => id !== (item.id as string))
            .map((item, i) => {
              return <Text>item.name</Text>
            })}
      </View>
    </View>
  )
}
