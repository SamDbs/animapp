import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Product } from '@hooks/stores/product'
import useSearchableList, { PaginationDetails } from '@hooks/useSearchableList'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import type { UseStore, StateSelector } from 'zustand'

import SubItem from './SubItem'

type Props<
  OwnerItem extends Product,
  OwnedItem extends Ingredient | Constituent,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
> = {
  ownerEntityId: OwnerItem['id']
  useOwnedStore: UseStore<StoreShape>
  ownedItemsGetterSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id']) => Promise<{ ids: OwnedItem['id'][] }>
  >
  ownedItemsUpdaterSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id'], ownedId: OwnedItem['id'], params?: string) => Promise<void>
  >
  ownedItemsDeletorSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id'], ownedId: OwnedItem['id']) => Promise<void>
  >
  ownedItemsSelectorCreator: (
    ids: OwnedItem['id'][],
  ) => StateSelector<StoreShape, Partial<OwnedItem>[]>
  registerOwnedIdsSelector: StateSelector<StoreShape, (ids: OwnedItem['id'][]) => void>
  unregisterOwnedIdsSelector: StateSelector<StoreShape, (ids: OwnedItem['id'][]) => void>
  relationParams?: boolean

  searchItemsSelector: StateSelector<
    StoreShape,
    (str: string, page?: number) => Promise<{ pagination: PaginationDetails; ids: string[] }>
  >
  ownedEntityLinkCreator: (item: Partial<OwnedItem>) => string
}

export default function ManyToMany<
  OwnerItem extends Product,
  OwnedItem extends Ingredient | Constituent,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
>({
  ownerEntityId,
  useOwnedStore,
  ownedItemsGetterSelector,
  ownedItemsUpdaterSelector,
  ownedItemsDeletorSelector,
  ownedItemsSelectorCreator,
  registerOwnedIdsSelector,
  unregisterOwnedIdsSelector,
  searchItemsSelector,
  relationParams,
  ownedEntityLinkCreator,
}: Props<OwnerItem, OwnedItem, StoreShape>) {
  const [ids, setIds] = useState<OwnedItem['id'][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const getOwnedByOwnerId = useOwnedStore(ownedItemsGetterSelector)
  const upsertOwnedToOwner = useOwnedStore(ownedItemsUpdaterSelector)
  const deleteOwnedFromOwner = useOwnedStore(ownedItemsDeletorSelector)
  const ownedItemsSelector = useCallback(ownedItemsSelectorCreator(ids), [ids])
  const ownedEntities = useOwnedStore(ownedItemsSelector)
  const registerOwnedIds = useOwnedStore(registerOwnedIdsSelector)
  const unregisterOwnedIds = useOwnedStore(unregisterOwnedIdsSelector)
  const [editing, setEditing] = useState(false)
  const [relation, setRelation] = useState<Record<string, string>>({})
  const {
    isLoading: isLoadingOwnedItems,
    items: ownedItems,
    noResult: noResultOwnedItems,
    searchDebounced: searchOwnedItems,
  } = useSearchableList<StoreShape, OwnedItem>(
    useOwnedStore,
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

  const updateOwned = async (ownedId: OwnedItem['id']) => {
    await upsertOwnedToOwner(ownerEntityId, ownedId, relation[ownedId as string])
    setIds((ids) => [...ids, ownedId])
  }

  const deleteOwned = async (ownedId: OwnedItem['id']) => {
    await deleteOwnedFromOwner(ownerEntityId, ownedId)
    setIds((ids) => ids.filter((x) => x !== ownedId))
  }

  if (isLoading) return <ActivityIndicator />

  return (
    <View>
      <View
        style={{
          marginTop: 16,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 3,
          overflow: 'hidden',
        }}>
        {ownedEntities.filter(Boolean).map((item, i) => (
          <SubItem<OwnedItem>
            key={item.id}
            entityLinkCreator={ownedEntityLinkCreator}
            item={item}
            even={i % 2 === 0}>
            {relationParams && (
              <Text style={{ marginRight: 8 }}>{relation[item.id as string]}</Text>
            )}
            {editing && (
              <Button title="Unlink" onPress={() => deleteOwned(item.id as string)} color="#c00" />
            )}
          </SubItem>
        ))}
      </View>
      {editing && (
        <>
          <Text style={{ marginTop: 16 }}>Link new items</Text>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              height: 30,
              paddingHorizontal: 8,
              marginVertical: 8,
            }}
            onChangeText={searchOwnedItems}
            placeholder="Search"
          />
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
                .filter((item) => !ids.includes(item.id as string))
                .map((item, i) => {
                  return (
                    <SubItem<OwnedItem>
                      key={item.id}
                      entityLinkCreator={ownedEntityLinkCreator}
                      item={item}
                      even={i % 2 === 0}>
                      {relationParams && (
                        <TextInput
                          onChangeText={(text) => {
                            setRelation((state) => ({ ...state, [item.id as string]: text }))
                          }}
                          style={{
                            padding: 8,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 3,
                            flex: 1,
                            marginRight: 8,
                          }}
                        />
                      )}
                      <Button title="Link" onPress={() => updateOwned(item.id as string)} />
                    </SubItem>
                  )
                })}
          </View>
        </>
      )}
      <Button title={editing ? 'Close' : 'Edit'} onPress={() => setEditing((x) => !x)} />
    </View>
  )
}
