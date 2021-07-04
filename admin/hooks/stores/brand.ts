import { Product } from '@hooks/stores/product'
import { PaginationDetails } from '@hooks/useSearchableList'
import { debounce, keyBy, omit } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from '.'

export type Brand = {
  id: string
  name: string
}

export type BrandStore = {
  brands: Record<Brand['id'], Brand>
  usedBrandIds: Record<Brand['id'], number>
  registerIds: (ids: Brand['id'][]) => void
  unregisterIds: (ids: Brand['id'][]) => void
  getBrandById: (id: Brand['id']) => Promise<{ id: Brand['id'] }>
  getBrandByProductId: (id: Product['id']) => Promise<{ id: Brand['id'] }>
  updateBrand: (id: Brand['id'], params: Partial<Brand>) => Promise<void>
  restoreBrand: (id: Brand['id']) => Promise<void>
  deleteBrand: (id: Brand['id']) => Promise<void>
  searchBrands: (
    text: Brand['name'],
    page?: number,
  ) => Promise<{ pagination: PaginationDetails; ids: Brand['id'][] }>
  searchDeletedBrands: (
    text: Brand['name'],
    page?: number,
  ) => Promise<{ pagination: PaginationDetails; ids: Brand['id'][] }>
  createBrand: (params: { name: string }) => Promise<unknown>
}

let combinedBrandUpdate = {}
async function prepareBrandUpdate(id: Brand['id'], params: Partial<Brand>) {
  combinedBrandUpdate = { ...combinedBrandUpdate, ...params }
  await sendBrandCombinedUpdateDebounce(id, combinedBrandUpdate)
}
const sendBrandCombinedUpdateDebounce = debounce(
  1000,
  async (id: Brand['id'], params: Partial<Brand>) => {
    await fetcher.patch(`/brands/${id}`, params)
    combinedBrandUpdate = {}
  },
)

const useBrandStore = create<BrandStore>(
  devtools(
    (set) => ({
      brands: {},
      usedBrandIds: {},
      registerIds(ids: Brand['id'][]) {
        set((state) => {
          const update: Record<Brand['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedBrandIds ? state.usedBrandIds[id] + 1 : 1,
            }),
            {},
          )

          const newState = {
            ...state,
            usedBrandIds: { ...state.usedBrandIds, ...update },
          }

          const idsToDelete = Object.entries(newState.usedBrandIds)
            .filter(([, value]) => value < 1)
            .map(([key]) => key)

          const finalState = {
            ...newState,
            brands: omit(idsToDelete, newState.brands),
            usedBrandIds: omit(idsToDelete, newState.usedBrandIds),
          }
          return finalState
        })
      },
      unregisterIds(ids: Brand['id'][]) {
        set((state) => {
          const update: Record<Brand['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedBrandIds ? state.usedBrandIds[id] - 1 : 0,
            }),
            {},
          )
          const newState = {
            ...state,
            usedBrandIds: { ...state.usedBrandIds, ...update },
          }
          return newState
        })
      },
      async getBrandById(id: string) {
        const { data } = await fetcher.get<Brand>(`/brands/${id}`)
        const brand = { ...data, id: data.id.toString() }

        set((state) => ({ brands: { ...state.brands, [brand.id]: brand } }))
        return { id }
      },
      async getBrandByProductId(productId: string) {
        const { data } = await fetcher.get<Brand>(`/products/${productId}/brand`)
        const brand = { ...data, id: data.id.toString() }

        set((state) => ({ brands: { ...state.brands, [brand.id]: brand } }))
        return { id: brand.id }
      },
      async updateBrand(id: Brand['id'], params: Partial<Brand>) {
        set((state) => ({
          ...state,
          brands: { ...state.brands, [id]: { ...state.brands[id], ...params } },
        }))
        await prepareBrandUpdate(id, params)
      },
      async restoreBrand(id: Brand['id']) {
        await fetcher.patch<Brand>(`/brands/${id}`, { deletedAt: null })
      },
      async deleteBrand(id: Brand['id']) {
        await fetcher.delete<Brand>(`/brands/${id}`)
      },
      async searchBrands(text: string, page = 0) {
        const { data } = await fetcher.get<{ pagination: PaginationDetails; brands: Brand[] }>(
          `/brands`,
          { params: { q: text, page } },
        )

        const brands = data.brands.map((brand) => ({
          ...brand,
          id: brand.id.toString(),
        }))

        const ids = brands.map((brand) => brand.id)
        const entities = keyBy((brand) => brand.id, brands)

        set((state) => ({ brands: { ...state.brands, ...entities } }))
        return { pagination: data.pagination, ids }
      },
      createBrand(params: { name: string }) {
        return fetcher.post(`/brands`, params)
      },
      async searchDeletedBrands(text: string, page = 0) {
        const { data } = await fetcher.get<{ pagination: PaginationDetails; brands: Brand[] }>(
          `/brands`,
          { params: { q: text, page, deleted: true } },
        )

        const brands = data.brands.map((brand) => ({
          ...brand,
          id: brand.id.toString(),
        }))

        const ids = brands.map((brand) => brand.id)
        const entities = keyBy((brand) => brand.id, brands)

        set((state) => ({ brands: { ...state.brands, ...entities } }))
        return { pagination: data.pagination, ids }
      },
    }),
    'brand',
  ),
)
export default useBrandStore
