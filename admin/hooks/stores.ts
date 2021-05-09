import { combine, devtools } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import create from 'zustand'
import { filter, keyBy, keys, map, mapValues, omit, omitBy, pickBy, reduce } from 'lodash'

export const useAuthStore = create(
  devtools(
    combine({ jwt: '' as string }, (set) => ({
      async login({ login, password }: { login: string; password: string }) {
        const { data } = await axios.post(`${process.env.API_URL}/auth`, { login, password })
        const { jwt } = data

        await AsyncStorage.setItem('jwt', jwt)

        return set({ jwt })
      },
      setJwt: (jwt: string) => set({ jwt }),
    })),
  ),
)

export type Product = {
  id: string
}

export const useProductsStore = create(
  devtools(
    combine(
      {
        products: {} as Record<Product['id'], Product>,
        usedProductIds: {} as Record<Product['id'], number>,
      },
      (set) => ({
        registerIds(ids: Product['id'][]) {
          set((state) => {
            const update: Record<Product['id'], number> = ids.reduce(
              (acc, id) => ({
                ...acc,
                [id]: id in state.usedProductIds ? state.usedProductIds[id] + 1 : 1,
              }),
              {},
            )

            const newState = {
              ...state,
              usedProductIds: { ...state.usedProductIds, ...update },
            }

            const idsToDelete = Object.entries(newState.usedProductIds)
              .filter(([, value]) => value < 1)
              .map(([key]) => key)

            const finalState = {
              ...newState,
              products: omit(newState.products, idsToDelete),
              usedProductIds: omit(newState.usedProductIds, idsToDelete),
            }
            return finalState
          })
        },
        unregisterIds(ids: Product['id'][]) {
          set((state) => {
            const update: Record<Product['id'], number> = ids.reduce(
              (acc, id) => ({
                ...acc,
                [id]: id in state.usedProductIds ? state.usedProductIds[id] - 1 : 0,
              }),
              {},
            )
            const newState = { ...state, usedProductIds: { ...state.usedProductIds, ...update } }
            return newState
          })
        },
        async getProducts() {
          const { jwt } = useAuthStore.getState()
          const { data } = await axios.get<Product[]>(`${process.env.API_URL}/products`, {
            headers: { Authorization: jwt },
          })

          const products = data.map((product) => ({ ...product, id: product.id.toString() }))

          const ids = map(products, (product) => product.id)
          const entities = keyBy(products, (product) => product.id)

          set((state) => ({ products: { ...state.products, ...entities } }))
          return { ids }
        },
        async searchProducts(params: { name: string }) {
          const { jwt } = useAuthStore.getState()
          const { data } = await axios.get<Product[]>(`${process.env.API_URL}/products`, {
            headers: { Authorization: jwt },
            params,
          })

          const products = data.map((product) => ({ ...product, id: product.id.toString() }))

          const ids = map(products, (product) => product.id)
          const entities = keyBy(products, (product) => product.id)

          set((state) => ({ products: { ...state.products, ...entities } }))
          return { ids }
        },
        createProduct(params: { barCode: string; name: string; type: string }) {
          const { jwt } = useAuthStore.getState()
          return axios.post(`${process.env.API_URL}/products`, params, {
            headers: { Authorization: jwt },
          })
        },
      }),
    ),
  ),
)
