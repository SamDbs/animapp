import { PaginationDetails } from '@hooks/useSearchableList'
import { keyBy, omit } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'
import { Product } from './product'

export type Constituent = {
  id: string
  name: string
  description: string
}

export type ProductConstituent = {
  productId: string
  constituentId: string
  quantity: string
}

export type ConstituentStoreState = {
  constituents: Record<Constituent['id'], Constituent>
  usedConstituentIds: Record<Constituent['id'], number>
  productConstituents: Record<string, Partial<ProductConstituent>>
  registerIds: (ids: Constituent['id'][]) => void
  unregisterIds: (ids: Constituent['id'][]) => void
  getConstituentById: (id: Constituent['id']) => Promise<{ id: Constituent['id'] }>
  searchConstituents: (
    query: string,
    page?: number,
  ) => Promise<{ ids: Constituent['id'][]; pagination: PaginationDetails }>
  createConstituent: () => Promise<unknown>
  getConstituentsByProductId: (productId: Product['id']) => Promise<{ ids: Constituent['id'][] }>
  updateConstituentsByProductId: (
    productId: Product['id'],
    constituentId: Constituent['id'],
    params?: string,
  ) => Promise<void>
  deleteConstituentFromProductId: (
    productId: Product['id'],
    constituentId: Constituent['id'],
  ) => Promise<void>
}

const useConstituentsStore = create<ConstituentStoreState>(
  devtools(
    (set, get) => ({
      constituents: {},
      usedConstituentIds: {},
      productConstituents: {},
      registerIds(ids: Constituent['id'][]) {
        set((state) => {
          const update: Record<Constituent['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedConstituentIds ? state.usedConstituentIds[id] + 1 : 1,
            }),
            {},
          )

          const newState = {
            ...state,
            usedConstituentIds: { ...state.usedConstituentIds, ...update },
          }

          const idsToDelete = Object.entries(newState.usedConstituentIds)
            .filter(([, value]) => value < 1)
            .map(([key]) => key)

          const finalState = {
            ...newState,
            constituents: omit(idsToDelete, newState.constituents),
            usedConstituentIds: omit(idsToDelete, newState.usedConstituentIds),
          }
          return finalState
        })
      },
      unregisterIds(ids: Constituent['id'][]) {
        set((state) => {
          const update: Record<Constituent['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedConstituentIds ? state.usedConstituentIds[id] - 1 : 0,
            }),
            {},
          )
          const newState = {
            ...state,
            usedConstituentIds: { ...state.usedConstituentIds, ...update },
          }
          return newState
        })
      },
      async getConstituentById(id: string) {
        const { data } = await fetcher.get<Constituent>(`/analytical-constituents/${id}`)
        const constituent = { ...data, id: data.id.toString() }

        set((state) => ({ constituents: { ...state.constituents, [constituent.id]: constituent } }))
        return { id }
      },
      async searchConstituents(query: string, page = 0) {
        const { data } = await fetcher.get<{
          constituents: Constituent[]
          pagination: PaginationDetails
        }>(`/analytical-constituents`, {
          params: { q: query, page },
        })

        const constituents = data.constituents.map((constituent) => ({
          ...get().constituents[constituent.id.toString()],
          ...constituent,
          id: constituent.id.toString(),
        }))

        const ids = constituents.map((constituent) => constituent.id)
        const entities = keyBy((constituent) => constituent.id, constituents)

        set((state) => ({ constituents: { ...state.constituents, ...entities } }))
        return { ids, pagination: data.pagination }
      },
      createConstituent() {
        return fetcher.post(`/analytical-constituents`)
      },
      async getConstituentsByProductId(productId) {
        const { data } = await fetcher.get<{
          analyticalConstituents: Constituent[]
          relations: ProductConstituent[]
        }>(`/products/${productId}/analytical-constituents`)

        const constituents = data.analyticalConstituents.map((constituent) => ({
          ...constituent,
          id: constituent.id.toString(),
        }))
        const relations = data.relations.map((relation) => ({
          ...relation,
          id: `${relation.productId.toString()}-${relation.constituentId.toString()}`,
        }))

        const ids = constituents.map((constituent) => constituent.id)
        const entities = keyBy((constituent) => constituent.id, constituents)

        set((state) => ({
          ...state,
          productConstituents: keyBy((relation) => relation.id, relations),
          constituents: { ...state.constituents, ...entities },
        }))

        return { ids }
      },
      async updateConstituentsByProductId(productId, constituentId, param = '') {
        await fetcher.put<Constituent[]>(
          `/products/${productId}/analytical-constituents/${constituentId}`,
          { quantity: param },
        )
        set((state) => ({
          ...state,
          productConstituents: {
            ...state.productConstituents,
            [`${productId.toString()}-${constituentId.toString()}`]: {
              constituentId,
              productId,
              quantity: param,
            },
          },
        }))
      },
      async deleteConstituentFromProductId(productId, constituentId) {
        await fetcher.delete<Constituent[]>(
          `/products/${productId}/analytical-constituents/${constituentId}`,
          {},
        )
      },
    }),
    'constituent',
  ),
)

export default useConstituentsStore
