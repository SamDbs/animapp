import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = '@productsHistory'

export default function useProductHistoryContextValue(): {
  historyProductsIds: string[]
  removeProduct:(id:string) => Promise<void>
  viewProduct: (id: string) => Promise<void>
} {
  const [historyProductsIds, setHistoryProductsIds] = useState<string[]>([])

  const viewProduct = useCallback(
    async (id) => {
      const storageHistory = await AsyncStorage.getItem(STORAGE_KEY)
      const currentIds: string[] = storageHistory ? JSON.parse(storageHistory) : []
      const otherIds = currentIds.filter((i) => i !== id)
      const newIdsArray = [id, ...otherIds]
      setHistoryProductsIds(newIdsArray)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIdsArray))
    },
    [historyProductsIds.join('-')],
  )

  const removeProduct = useCallback(
    async (id) => {
      const storageHistory = await AsyncStorage.getItem(STORAGE_KEY)
      const currentIds: string[] = storageHistory ? JSON.parse(storageHistory) : []
      const newIdsArray = currentIds.filter((i) => i !== id)
      setHistoryProductsIds(newIdsArray)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newIdsArray))
    },
    [historyProductsIds.join('-')],
  )

  const refresh = useCallback(async () => {
    async function getHistoryProducts() {
      const storageHistory = await AsyncStorage.getItem(STORAGE_KEY)
      if (!storageHistory) {
        setHistoryProductsIds([])
        return
      }
      setHistoryProductsIds(JSON.parse(storageHistory))
    }
    getHistoryProducts()
  }, [])



  useEffect(() => {
    refresh()
  }, [])

  return { historyProductsIds, viewProduct, removeProduct }
}
