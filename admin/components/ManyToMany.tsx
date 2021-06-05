import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import { Link } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import type { UseStore, StateSelector } from 'zustand'

import { Ingredient } from '@hooks/stores/ingredient'
import { Product } from '@hooks/stores/product'
import useSearchableList from '@hooks/useSearchableList'

type Props<
  OwnerItem extends Product,
  OwnedItem extends Ingredient,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
  RelationParams extends {} = {},
> = {
  ownerEntityId: OwnerItem['id']
  useOwnedStore: UseStore<StoreShape>
  ownedItemsGetterSelector: StateSelector<
    StoreShape,
    (productId: OwnerItem['id']) => Promise<{ ids: OwnedItem['id'][] }>
  >
  ownedItemsSelectorCreator: (
    ids: OwnedItem['id'][],
  ) => StateSelector<StoreShape, Partial<OwnedItem>[]>
  registerOwnedIdsSelector: StateSelector<StoreShape, (ids: OwnedItem['id'][]) => void>
  unregisterOwnedIdsSelector: StateSelector<StoreShape, (ids: OwnedItem['id'][]) => void>
  relationParams?: RelationParams

  getItemsSelector: StateSelector<StoreShape, () => Promise<{ ids: string[] }>>
  searchItemsSelector: StateSelector<StoreShape, (str: string) => Promise<{ ids: string[] }>>
}

export default function ManyToMany<
  OwnerItem extends Product,
  OwnedItem extends Ingredient,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
  RelationParams extends {} = {},
>({
  ownerEntityId,
  useOwnedStore,
  ownedItemsGetterSelector,
  ownedItemsSelectorCreator,
  registerOwnedIdsSelector,
  unregisterOwnedIdsSelector,
  getItemsSelector,
  searchItemsSelector,
  relationParams,
}: Props<OwnerItem, OwnedItem, StoreShape, RelationParams>) {
  const [ids, setIds] = useState<OwnedItem['id'][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const getOwnedByOwnerId = useOwnedStore(ownedItemsGetterSelector)
  const ownedItemsSelector = useCallback(ownedItemsSelectorCreator(ids), [ids])
  const ownedEntities = useOwnedStore(ownedItemsSelector)
  const registerOwnedIds = useOwnedStore(registerOwnedIdsSelector)
  const unregisterOwnedIds = useOwnedStore(unregisterOwnedIdsSelector)

  const {
    isLoading: isLoadingOwnedItems,
    items: ownedItems,
    noResult: noResultOwnedItems,
    searchDebounced: searchOwnedItems,
  } = useSearchableList<StoreShape, OwnedItem>(
    useOwnedStore,
    getItemsSelector,
    searchItemsSelector,
    ownedItemsSelectorCreator,
  )

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const { ids } = await getOwnedByOwnerId(ownerEntityId)
      setIds(ids)
      setIsLoading(false)
    }
    init()
  }, [ownerEntityId])

  useEffect(() => {
    registerOwnedIds(ids)
    return () => unregisterOwnedIds(ids)
  }, [ids])

  if (isLoading) return <ActivityIndicator />

  return (
    <View>
      {ownedEntities.filter(Boolean).map((entity, i) => (
        <Link key={i} to={`/ingredients/${entity.id}`}>
          <Text>{entity.name}</Text>
        </Link>
      ))}
      <View>
        <View>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              height: 30,
              paddingHorizontal: 8,
              marginBottom: 16,
            }}
            onChangeText={searchOwnedItems}
            placeholder="Search"
          />
          {isLoadingOwnedItems && <ActivityIndicator />}
          {!noResultOwnedItems &&
            ownedItems
              .filter((item) => !ids.includes(item.id as string))
              .map((item) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                    <Text>{item.name}</Text>
                    <Button title="Link" onPress={() => console.log('oui')} />
                  </View>
                )
              })}
        </View>
      </View>
    </View>
  )
}
