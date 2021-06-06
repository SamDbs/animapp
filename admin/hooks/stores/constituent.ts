import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { debounce, keyBy, omit } from 'lodash/fp'

import { fetcher } from './index'

export type Constituent = {
  id: string
  name: string
  description: string
}

let combinedConstituentUpdate = {}
async function prepareConstituentUpdate(id: Constituent['id'], params: Partial<Constituent>) {
  combinedConstituentUpdate = { ...combinedConstituentUpdate, ...params }
  await sendConstituentCombinedUpdateDebounce(id, combinedConstituentUpdate)
}
const sendConstituentCombinedUpdateDebounce = debounce(
  1000,
  async (id: Constituent['id'], params: Partial<Constituent>) => {
    await fetcher.patch(`/analyticalConstituents/${id}`, params)
    combinedConstituentUpdate = {}
  },
)

export type ConstituentStoreState = {
  constituents: Record<Constituent['id'], Constituent>
  usedConstituentIds: Record<Constituent['id'], number>
  registerIds: (ids: Constituent['id'][]) => void
  unregisterIds: (ids: Constituent['id'][]) => void
  getConstituentById: (id: Constituent['id']) => Promise<{ id: Constituent['id'] }>
  getConstituents: () => Promise<{ ids: Constituent['id'][] }>
  updateConstituent: (id: Constituent['id'], params: Partial<Constituent>) => Promise<void>
  searchConstituents: (query: string) => Promise<{ ids: Constituent['id'][] }>
  createConstituent: () => Promise<unknown>
}

const useConstituentsStore = create<ConstituentStoreState>(
  devtools((set) => ({
    constituents: {},
    usedConstituentIds: {},
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
      const { data } = await fetcher.get<Constituent>(`/analyticalConstituents/${id}`)
      const constituent = { ...data, id: data.id.toString() }

      set((state) => ({ constituents: { ...state.constituents, [constituent.id]: constituent } }))
      return { id }
    },
    async getConstituents() {
      const { data } = await fetcher.get<Constituent[]>(`/analyticalConstituents`)

      const constituents = data.map((constituent) => ({
        ...constituent,
        id: constituent.id.toString(),
      }))

      const ids = constituents.map((constituent) => constituent.id)
      const entities = keyBy((constituent) => constituent.id, constituents)

      set((state) => ({ constituents: { ...state.constituents, ...entities } }))
      return { ids }
    },
    async updateConstituent(id: Constituent['id'], params: Partial<Constituent>) {
      set((state) => ({
        ...state,
        constituents: { ...state.constituents, [id]: { ...state.constituents[id], ...params } },
      }))
      await prepareConstituentUpdate(id, params)
    },
    async searchConstituents(query: string) {
      const { data } = await fetcher.get<Constituent[]>(`/analyticalConstituents`, { params: { q: query } })

      const constituents = data.map((constituent) => ({
        ...constituent,
        id: constituent.id.toString(),
      }))

      const ids = constituents.map((constituent) => constituent.id)
      const entities = keyBy((constituent) => constituent.id, constituents)

      set((state) => ({ constituents: { ...state.constituents, ...entities } }))
      return { ids }
    },
    createConstituent() {
      return fetcher.post(`/analyticalConstituents`)
    },
  })),
)

export default useConstituentsStore
