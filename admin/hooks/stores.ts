import { combine, devtools } from 'zustand/middleware'
import { keyBy, map, omit } from 'lodash'
import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'

import createFetcher from '@utils/createFetcher'

let fetcher = createFetcher()

export const useAuthStore = create(
  devtools(
    combine({ jwt: '' as string }, (set) => ({
      async login({ login, password }: { login: string; password: string }) {
        const { data } = await fetcher.post(`/auth`, { login, password })
        const { jwt } = data

        await AsyncStorage.setItem('jwt', jwt)
        return set({ jwt })
      },
      async loginUsingAsyncStorage() {
        const jwt = await AsyncStorage.getItem('jwt')

        if (jwt) return set({ jwt })
        else return set({ jwt: '' })
      },
      async logout() {
        await AsyncStorage.removeItem('jwt')
        return set({ jwt: '' })
      },
    })),
  ),
)

useAuthStore.subscribe(
  (jwt: string) => {
    fetcher = createFetcher(jwt)
  },
  (state) => state.jwt,
)

export type Product = {
  id: string
  name: string
  type: string
  image: string
  barCode: string
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
        async getProductById(id: string) {
          const { jwt } = useAuthStore.getState()
          const { data } = await fetcher.get<Product>(`/products/${id}`, {
            headers: { Authorization: jwt },
          })
          const product = { ...data, id: data.id.toString() }

          set((state) => ({ products: { ...state.products, [product.id]: product } }))
          return { id }
        },
        async getProducts() {
          const { jwt } = useAuthStore.getState()
          const { data } = await fetcher.get<Product[]>(`/products`, {
            headers: { Authorization: jwt },
          })

          const products = data.map((product) => ({ ...product, id: product.id.toString() }))

          const ids = map(products, (product) => product.id)
          const entities = keyBy(products, (product) => product.id)

          set((state) => ({ products: { ...state.products, ...entities } }))
          return { ids }
        },
        async updateProduct(
          id: string,
          params: {
            name?: string
            type?: string
            barCode?: string
          },
        ) {
          set((state) => ({
            ...state,
            products: { ...state.products, [id]: { ...state.products[id], ...params } },
          }))
          const { jwt } = useAuthStore.getState()
          await fetcher.patch(`/products/${id}`, params, {
            headers: { Authorization: jwt },
          })
        },
        async searchProducts(params: { name: string }) {
          const { jwt } = useAuthStore.getState()
          const { data } = await fetcher.get<Product[]>(`/products`, {
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
          return fetcher.post(`/products`, params, {
            headers: { Authorization: jwt },
          })
        },
      }),
    ),
  ),
)
