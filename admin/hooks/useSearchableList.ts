import debounce from 'lodash/fp/debounce'
import { useCallback, useEffect, useState } from 'react'
import { StateSelector, UseStore } from 'zustand'

export default function useSearchableList<StoreShape extends object, EntityShape extends object>(
  useStore: UseStore<
    StoreShape & { registerIds: (ids: string[]) => void; unregisterIds: (ids: string[]) => void }
  >,
  getItemsSelector: StateSelector<StoreShape, () => Promise<{ ids: string[] }>>,
  searchItemsSelector: StateSelector<StoreShape, (str: string) => Promise<{ ids: string[] }>>,
  ownedItemsSelectorCreator: (ids: string[]) => StateSelector<StoreShape, Partial<EntityShape>[]>,
) {
  const [ids, setItemIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds] = useStore((state) => [state.registerIds, state.unregisterIds])
  const getItemsFn = useStore(getItemsSelector)
  const searchItemsFn = useStore(searchItemsSelector)
  const items = useStore(useCallback(ownedItemsSelectorCreator(ids), [ids]))

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setIsLoading(true)
      const { ids } = await searchItemsFn(text)
      setItemIds(ids)
      setIsLoading(false)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids } = await getItemsFn()
      setItemIds(ids)
      setIsLoading(false)
    }
    fn()
  }, [])

  const noResult = !items.length

  return {
    items,
    isLoading,
    noResult,
    searchDebounced,
  }
}
