import type { Brand } from '@hooks/stores/brand'
import type { Product } from '@hooks/stores/product'
import useSearchableList from '@hooks/useSearchableList'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import type { UseStore, StateSelector } from 'zustand'

import SubItem from './SubItem'

type Props<
  OwnerEntity extends Brand,
  OwnerStateShape extends object,
  OwnedEntity extends Product,
  OwnedStoreShape extends object,
> = {
  getOwnerByOwnedIdSelect: StateSelector<
    OwnerStateShape,
    (ownedId: OwnedEntity['id']) => Promise<{ id: OwnerEntity['id'] }>
  >
  getOwnersSelector: StateSelector<OwnerStateShape, () => Promise<{ ids: string[] }>>
  ownedId?: OwnedEntity['id']
  ownerEntityLinkCreator: (item: Partial<OwnerEntity>) => string
  ownerSelectorCreator: (
    id: OwnerEntity['id'],
  ) => StateSelector<OwnerStateShape, Partial<OwnerEntity>>
  ownersSelectorCreator: (
    ids: OwnerEntity['id'][],
  ) => StateSelector<OwnerStateShape, Partial<OwnerEntity>[]>
  registerOwnerIdsSelector: StateSelector<OwnerStateShape, (ids: OwnerEntity['id'][]) => void>
  searchOwnersSelector: StateSelector<
    OwnerStateShape,
    (query: string) => Promise<{ ids: OwnerEntity['id'][] }>
  >
  setOwnerId?: (ownerId: OwnerEntity['id']) => void
  unregisterOwnerIdsSelector: StateSelector<OwnerStateShape, (ids: OwnerEntity['id'][]) => void>
  updateOwnerInOwnedSelector: StateSelector<
    OwnedStoreShape,
    (ownedId: OwnedEntity['id'], ownerId: OwnerEntity['id']) => Promise<void>
  >
  useOwnedStore: UseStore<OwnedStoreShape>
  useOwnerStore: UseStore<
    OwnerStateShape & {
      registerIds: (ids: string[]) => void
      unregisterIds: (ids: string[]) => void
    }
  >
}

export default function OneToMany<
  OwnerEntity extends Brand,
  OwnerStateShape extends object,
  OwnedEntity extends Product,
  OwnedStoreShape extends object,
>({
  getOwnerByOwnedIdSelect,
  getOwnersSelector,
  ownedId,
  ownerEntityLinkCreator,
  ownerSelectorCreator,
  ownersSelectorCreator,
  registerOwnerIdsSelector,
  searchOwnersSelector,
  setOwnerId,
  unregisterOwnerIdsSelector,
  updateOwnerInOwnedSelector,
  useOwnedStore,
  useOwnerStore,
}: Props<OwnerEntity, OwnerStateShape, OwnedEntity, OwnedStoreShape>) {
  const [id, setId] = useState<OwnerEntity['id']>()
  const [isLoading, setIsLoading] = useState(false)
  const [editing, setEditing] = useState(Boolean(!ownedId))
  const {
    isLoading: isLoadingOwnerItems,
    items: ownerItems,
    noResult: noResultOwnerItems,
    searchDebounced: searchOwnerItems,
  } = useSearchableList<OwnerStateShape, OwnerEntity>(
    useOwnerStore,
    getOwnersSelector,
    searchOwnersSelector,
    ownersSelectorCreator,
  )

  const getOwnerByOwnedId = useOwnerStore(getOwnerByOwnedIdSelect)
  const updateOwnerInOwned = useOwnedStore(updateOwnerInOwnedSelector)
  const registerOwnedIds = useOwnerStore(registerOwnerIdsSelector)
  const unregisterOwnedIds = useOwnerStore(unregisterOwnerIdsSelector)

  useEffect(() => {
    async function init() {
      if (!ownedId) return
      setIsLoading(true)
      const { id } = await getOwnerByOwnedId(ownedId)
      setId(id)
      setIsLoading(false)
    }
    init()
  }, [ownedId])

  useEffect(() => {
    if (!id) return
    registerOwnedIds([id])
    return () => unregisterOwnedIds([id])
  }, [id])

  const updateOwned = async (ownerId: OwnerEntity['id']) => {
    if (!ownedId) {
      if (setOwnerId) {
        setOwnerId(ownerId)
        setEditing(false)
      }
      return
    }
    await updateOwnerInOwned(ownedId, ownerId)
    setId(ownerId)
  }

  const owner = useOwnerStore(useCallback(id ? ownerSelectorCreator(id) : () => null, [id]))

  if (isLoading) return <ActivityIndicator />

  return (
    <View>
      {owner && (
        <View
          style={{
            marginTop: 16,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
          <SubItem<OwnerEntity>
            even
            key={owner.id}
            entityLinkCreator={ownerEntityLinkCreator}
            item={owner}
          />
        </View>
      )}
      {editing && (
        <>
          <Text style={{ marginTop: 16 }}>Link new item</Text>
          <TextInput
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              height: 30,
              paddingHorizontal: 8,
              marginVertical: 8,
            }}
            onChangeText={searchOwnerItems}
            placeholder="Search"
          />
          <View
            style={{
              marginTop: 16,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
            {isLoadingOwnerItems && <ActivityIndicator />}
            {!noResultOwnerItems &&
              ownerItems
                .filter((item) => id !== item.id)
                .map((item, i) => (
                  <SubItem<OwnerEntity>
                    even
                    key={item.id}
                    entityLinkCreator={ownerEntityLinkCreator}
                    item={item}>
                    <Button title="Replace" onPress={() => updateOwned(item.id as string)} />
                  </SubItem>
                ))}
          </View>
        </>
      )}
      <Button title={editing ? 'Close' : 'Edit'} onPress={() => setEditing((x) => !x)} />
    </View>
  )
}
