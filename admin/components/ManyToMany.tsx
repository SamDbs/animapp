import { ActivityIndicator, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import type { UseStore, StateSelector } from 'zustand'
import { Link } from '@react-navigation/native'

import { Ingredient } from '@hooks/stores/ingredient'
import { Product } from '@hooks/stores/product'

type Props<OwnerItem extends Product, OwnedItem extends Ingredient, StoreShape extends object> = {
  ownerEntityId: OwnerItem['id']
  useOwnedStore: UseStore<StoreShape>
  ownedItemsGetterSelector: StateSelector<
    StoreShape,
    (productId: OwnerItem['id']) => Promise<{ ids: OwnedItem['id'][] }>
  >
  ownedItemsSelectorCreator: (
    ids: OwnedItem['id'][],
  ) => StateSelector<StoreShape, Partial<OwnedItem>[]>
}

export default function ManyToMany<
  OwnerItem extends Product,
  OwnedItem extends Ingredient,
  StoreShape extends object
>({
  ownerEntityId,
  useOwnedStore,
  ownedItemsGetterSelector,
  ownedItemsSelectorCreator,
}: Props<OwnerItem, OwnedItem, StoreShape>) {
  const [ids, setIds] = useState<OwnedItem['id'][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const getOwnedByOwnerId = useOwnedStore(ownedItemsGetterSelector)
  const ownedEntities = useOwnedStore(useCallback(ownedItemsSelectorCreator(ids), [ids]))

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const { ids } = await getOwnedByOwnerId(ownerEntityId)
      setIds(ids)
      setIsLoading(false)
    }
    init()
  }, [ownerEntityId])

  if (isLoading) return <ActivityIndicator />

  return (
    <View>
      {ownedEntities.filter(Boolean).map((entity, i) => (
        <Link key={i} to={`/ingredients/${entity.id}`}>
          <Text>{entity.name}</Text>
        </Link>
      ))}
    </View>
  )
}
