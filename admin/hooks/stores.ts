import { combine, devtools } from 'zustand/middleware'
import { debounce, keyBy, omit } from 'lodash/fp'
import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'

import createFetcher from '@utils/createFetcher'

export type TranslatedString = string

export type Product = {
  id: string
  name: string
  type: string
  image: string
  barCode: string
  description: TranslatedString
}

export type Language = {
  id: string
  name: string
}

export type ProductTranslation = {
  productId: Product['id']
  languageId: Product['id']
  description: string
}

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

let combinedProductUpdate = {}
async function prepareProductUpdate(id: Product['id'], params: Partial<Product>) {
  combinedProductUpdate = { ...combinedProductUpdate, ...params }
  await sendProductCombinedUpdateDebounce(id, combinedProductUpdate)
}
const sendProductCombinedUpdateDebounce = debounce(
  1000,
  async (id: Product['id'], params: Partial<Product>) => {
    await fetcher.patch(`/products/${id}`, params)
    combinedProductUpdate = {}
  },
)

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
              products: omit(idsToDelete, newState.products),
              usedProductIds: omit(idsToDelete, newState.usedProductIds),
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
          const { data } = await fetcher.get<Product>(`/products/${id}`)
          const product = { ...data, id: data.id.toString() }

          set((state) => ({ products: { ...state.products, [product.id]: product } }))
          return { id }
        },
        async getProducts() {
          const { data } = await fetcher.get<Product[]>(`/products`)

          const products = data.map((product) => ({ ...product, id: product.id.toString() }))

          const ids = products.map((product) => product.id)
          const entities = keyBy((product) => product.id, products)

          set((state) => ({ products: { ...state.products, ...entities } }))
          return { ids }
        },
        async updateProduct(
          id: Product['id'],
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
          await prepareProductUpdate(id, params)
        },
        async searchProducts(params: { name: string }) {
          const { data } = await fetcher.get<Product[]>(`/products`, { params })

          const products = data.map((product) => ({ ...product, id: product.id.toString() }))

          const ids = products.map((product) => product.id)
          const entities = keyBy((product) => product.id, products)

          set((state) => ({ products: { ...state.products, ...entities } }))
          return { ids }
        },
        createProduct(params: { barCode: string; name: string; type: string }) {
          return fetcher.post(`/products`, params)
        },
      }),
    ),
  ),
)

let combinedProductTranslationsUpdate: Record<
  ProductTranslation['languageId'],
  Partial<ProductTranslation>
> = {}

async function prepareProductTranslationsUpdate(
  productId: Product['id'],
  languageId: Language['id'],
  field: keyof ProductTranslation,
  value: string,
) {
  combinedProductTranslationsUpdate = {
    ...combinedProductTranslationsUpdate,
    [languageId]: {
      ...combinedProductTranslationsUpdate[languageId],
      [field]: value,
    },
  }
  await sendProductTranslationUpdateDebounced(productId)
}
const sendProductTranslationUpdateDebounced = debounce(1000, async (productId: Product['id']) => {
  await Promise.all(
    Object.keys(combinedProductTranslationsUpdate).map((key) =>
      fetcher.patch(
        `/products/${productId}/translations/${key}`,
        combinedProductTranslationsUpdate[key],
      ),
    ),
  )
  combinedProductTranslationsUpdate = {}
})

export const useProductTranslationStore = create(
  devtools(
    combine({ productTranslations: {} as Record<string, ProductTranslation> }, (set) => ({
      async getProductTranslations(productId: Product['id']) {
        const { data } = await fetcher.get<ProductTranslation[]>(
          `/products/${productId}/translations`,
        )

        const translations = data.map((translation) => ({
          ...translation,
          id: `${translation.productId.toString()}-${translation.languageId.toString()}`,
        }))

        const ids = translations.map((translation) => translation.id)
        const entities = keyBy((translation) => translation.id, translations)

        set((state) => ({ productTranslations: { ...state.productTranslations, ...entities } }))
        return { ids }
      },
      async updateProductTranslation(
        productId: Product['id'],
        languageId: Language['id'],
        field: keyof ProductTranslation,
        text: string,
      ) {
        set((state) => ({
          productTranslations: {
            ...state.productTranslations,
            [`${productId}-${languageId}`]: {
              ...state.productTranslations[`${productId}-${languageId}`],
              [field]: text,
            },
          },
        }))
        await prepareProductTranslationsUpdate(productId, languageId, field, text)
      },
    })),
  ),
)
