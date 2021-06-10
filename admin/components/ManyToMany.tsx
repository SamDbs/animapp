import { Constituent } from '@hooks/stores/constituent'
import { Ingredient } from '@hooks/stores/ingredient'
import { Product } from '@hooks/stores/product'
import useSearchableList from '@hooks/useSearchableList'
import { Link } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native'
import type { UseStore, StateSelector } from 'zustand'

type SubItemProps<OwnedItem extends Ingredient | Constituent> = {
  children?: JSX.Element | false
  item: Partial<OwnedItem>
  entityLinkCreator: (entity: Partial<OwnedItem>) => string
  even: boolean
}

function SubItem<OwnedItem extends Ingredient | Constituent>(props: SubItemProps<OwnedItem>) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: props.even ? '#f5f5f5' : '#fff',
        alignItems: 'center',
      }}>
      <Link to={props.entityLinkCreator(props.item)}>
        <Text>{props.item.name}</Text>
      </Link>
      {props.children && <View>{props.children}</View>}
    </View>
  )
}

type Props<
  OwnerItem extends Product,
  OwnedItem extends Ingredient | Constituent,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
  RelationParams extends object = object,
> = {
  ownerEntityId: OwnerItem['id']
  useOwnedStore: UseStore<StoreShape>
  ownedItemsGetterSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id']) => Promise<{ ids: OwnedItem['id'][] }>
  >
  ownedItemsUpdaterSelector: StateSelector<
    StoreShape,
    (ownerId: OwnerItem['id'], ownedId: OwnedItem['id']) => Promise<void>
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
  relationParams?: RelationParams

  getItemsSelector: StateSelector<StoreShape, () => Promise<{ ids: string[] }>>
  searchItemsSelector: StateSelector<StoreShape, (str: string) => Promise<{ ids: string[] }>>
  ownedEntityLinkCreator: (item: Partial<OwnedItem>) => string
}

export default function ManyToMany<
  OwnerItem extends Product,
  OwnedItem extends Ingredient | Constituent,
  StoreShape extends {
    registerIds: (ids: string[]) => void
    unregisterIds: (ids: string[]) => void
  },
  RelationParams extends object = object,
>({
  ownerEntityId,
  useOwnedStore,
  ownedItemsGetterSelector,
  ownedItemsUpdaterSelector,
  ownedItemsDeletorSelector,
  ownedItemsSelectorCreator,
  registerOwnedIdsSelector,
  unregisterOwnedIdsSelector,
  getItemsSelector,
  searchItemsSelector,
  relationParams,
  ownedEntityLinkCreator,
}: Props<OwnerItem, OwnedItem, StoreShape, RelationParams>) {
  const [ids, setIds] = useState<OwnedItem['id'][]>([])
  console.log('ids', ids)
  const [isLoading, setIsLoading] = useState(false)
  const getOwnedByOwnerId = useOwnedStore(ownedItemsGetterSelector)
  const upsertOwnedToOwner = useOwnedStore(ownedItemsUpdaterSelector)
  const deleteOwnedFromOwner = useOwnedStore(ownedItemsDeletorSelector)
  const ownedItemsSelector = useCallback(ownedItemsSelectorCreator(ids), [ids])
  const ownedEntities = useOwnedStore(ownedItemsSelector)
  const registerOwnedIds = useOwnedStore(registerOwnedIdsSelector)
  const unregisterOwnedIds = useOwnedStore(unregisterOwnedIdsSelector)
  const [editing, setEditing] = useState(false)
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

  const updateOwned = async (ownedId: OwnedItem['id']) => {
    await upsertOwnedToOwner(ownerEntityId, ownedId)
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
