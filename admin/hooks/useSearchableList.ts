import debounce from 'lodash/fp/debounce'
import { useCallback, useEffect, useState } from 'react'
import { StateSelector, UseStore } from 'zustand'

export type PaginationDetails = { count: number; limit: number; page: number }

export default function useSearchableList<StoreShape extends object, EntityShape extends object>(
  useStore: UseStore<
    StoreShape & { registerIds: (ids: string[]) => void; unregisterIds: (ids: string[]) => void }
  >,
  searchItemsSelector: StateSelector<
    StoreShape,
    (
      str: string,
      page: number,
      filters?: object,
    ) => Promise<{ pagination: PaginationDetails; ids: string[] }>
  >,
  ownedItemsSelectorCreator: (ids: string[]) => StateSelector<StoreShape, Partial<EntityShape>[]>,
) {
  const [page, setPage] = useState(0)
  const [ids, setItemIds] = useState<string[]>([])
  const [pagination, setPagination] = useState({ count: 0, limit: 0, offset: 0, page: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [registerIds, unregisterIds] = useStore((state) => [state.registerIds, state.unregisterIds])
  const searchItemsFn = useStore(searchItemsSelector)
  const items = useStore(useCallback(ownedItemsSelectorCreator(ids), [ids]))
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    registerIds(ids)
    return () => unregisterIds(ids)
  }, [ids])

  const searchDebounced = useCallback(
    debounce(500, async (text: string) => {
      setSearch(text)
    }),
    [],
  )

  useEffect(() => {
    async function fn() {
      setIsLoading(true)
      const { ids, pagination } = await searchItemsFn(search, page, filters)
      setItemIds(ids)
      pagination && setPagination(pagination)
      setIsLoading(false)
    }
    fn()
  }, [filters, page, search])

  const noResult = !items.length

  return {
    changePage: setPage,
    isLoading,
    items,
    noResult,
    pagination,
    searchDebounced,
    setFilters,
  }
}
