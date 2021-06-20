import { Brand } from '@hooks/stores/brand'
import { PaginationDetails } from '@hooks/useSearchableList'
import { debounce, keyBy, omit } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'

export type Product = {
  id: string
  name: string
  type: string
  published: boolean
  image: string
  barCode: string
  description: string
  brand: string
}

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

export type ProductStore = {
  products: Record<Product['id'], Product>
  usedProductIds: Record<Product['id'], number>
  registerIds: (ids: Product['id'][]) => void
  unregisterIds: (ids: Product['id'][]) => void
  getProductById: (id: Product['id']) => Promise<{ id: Product['id'] }>
  updateProductBrand: (id: Product['id'], brandId: Brand['id']) => Promise<void>
  updateProduct: (id: Product['id'], params: Partial<Product>) => Promise<void>
  searchProducts: (
    text: Product['name'],
    page: number,
    filters?: object,
  ) => Promise<{ pagination: PaginationDetails; ids: Product['id'][] }>
  createProduct: (params: { barCode: string; name: string; type: string }) => Promise<unknown>
  locallySetProductImage: (productId: Product['id'], image: string) => void
}

const useProductsStore = create<ProductStore>(
  devtools(
    (set, get) => ({
      products: {},
      usedProductIds: {},
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
      async getProductById(id: Product['id']) {
        const { data } = await fetcher.get<Product>(`/products/${id}`)
        const product = { ...data, id: data.id.toString() }

        set((state) => ({ products: { ...state.products, [product.id]: product } }))
        return { id }
      },
      async updateProduct(id: Product['id'], params: Partial<Product>) {
        set((state) => ({
          ...state,
          products: { ...state.products, [id]: { ...state.products[id], ...params } },
        }))
        await prepareProductUpdate(id, params)
      },
      async updateProductBrand(id: Product['id'], brandId: Brand['id']) {
        set((state) => ({
          ...state,
          products: { ...state.products, [id]: { ...state.products[id], brandId } },
        }))
        return fetcher.put(`/products/${id}/brand`, { brandId })
      },
      async searchProducts(text: string, page = 0, filters = {}) {
        const { data } = await fetcher.get<{ pagination: PaginationDetails; products: Product[] }>(
          `/products`,
          {
            params: { q: text, page, ...filters },
          },
        )

        const products = data.products.map((product) => ({ ...product, id: product.id.toString() }))

        const ids = products.map((product) => product.id)
        const entities = keyBy((product) => product.id, products)

        set((state) => ({ products: { ...state.products, ...entities } }))
        return { pagination: data.pagination, ids }
      },
      createProduct(params: { barCode: string; name: string; type: string }) {
        return fetcher.post(`/products`, params)
      },
      locallySetProductImage(productId: Product['id'], image: string) {
        if (!get().products[productId]) return
        set((state) => ({
          products: { ...state.products, [productId]: { ...state.products[productId], image } },
        }))
      },
    }),
    'product',
  ),
)

export default useProductsStore
