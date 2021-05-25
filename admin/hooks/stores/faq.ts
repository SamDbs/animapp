import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { debounce, keyBy, omit } from 'lodash/fp'

import { fetcher } from './index'

export type Faq = {
  id: string
  question: string
  answer: string
}

let combinedFaqUpdate = {}
async function prepareFaqUpdate(id: Faq['id'], params: Partial<Faq>) {
  combinedFaqUpdate = { ...combinedFaqUpdate, ...params }
  await sendFaqCombinedUpdateDebounce(id, combinedFaqUpdate)
}
const sendFaqCombinedUpdateDebounce = debounce(
  1000,
  async (id: Faq['id'], params: Partial<Faq>) => {
    await fetcher.patch(`/faq/${id}`, params)
    combinedFaqUpdate = {}
  },
)

export type FaqStoreState = {
  faqs: Record<Faq['id'], Faq>
  usedFaqIds: Record<Faq['id'], number>
  registerIds: (ids: Faq['id'][]) => void
  unregisterIds: (ids: Faq['id'][]) => void
  getFaqById: (id: Faq['id']) => Promise<{ id: Faq['id'] }>
  getFaqs: () => Promise<{ ids: Faq['id'][] }>
  updateFaq: (id: Faq['id'], params: Partial<Faq>) => Promise<void>
  searchFaqs: (query: string) => Promise<{ ids: Faq['id'][] }>
}

const useFaqStore = create<FaqStoreState>(
  devtools((set) => ({
    faqs: {},
    usedFaqIds: {},
    registerIds(ids: Faq['id'][]) {
      set((state) => {
        const update: Record<Faq['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedFaqIds ? state.usedFaqIds[id] + 1 : 1,
          }),
          {},
        )

        const newState = {
          ...state,
          usedFaqIds: { ...state.usedFaqIds, ...update },
        }

        const idsToDelete = Object.entries(newState.usedFaqIds)
          .filter(([, value]) => value < 1)
          .map(([key]) => key)

        const finalState = {
          ...newState,
          faqs: omit(idsToDelete, newState.faqs),
          usedFaqIds: omit(idsToDelete, newState.usedFaqIds),
        }
        return finalState
      })
    },
    unregisterIds(ids: Faq['id'][]) {
      set((state) => {
        const update: Record<Faq['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedFaqIds ? state.usedFaqIds[id] - 1 : 0,
          }),
          {},
        )
        const newState = {
          ...state,
          usedFaqIds: { ...state.usedFaqIds, ...update },
        }
        return newState
      })
    },
    async getFaqById(id: string) {
      const { data } = await fetcher.get<Faq>(`/faq/${id}`)
      const faq = { ...data, id: data.id.toString() }

      set((state) => ({ faqs: { ...state.faqs, [faq.id]: faq } }))
      return { id }
    },
    async getFaqs() {
      const { data } = await fetcher.get<Faq[]>(`/faq`)

      const faqs = data.map((faq) => ({
        ...faq,
        id: faq.id.toString(),
      }))

      const ids = faqs.map((faq) => faq.id)
      const entities = keyBy((faq) => faq.id, faqs)

      set((state) => ({ faqs: { ...state.faqs, ...entities } }))
      return { ids }
    },
    async updateFaq(id: Faq['id'], params: Partial<Faq>) {
      set((state) => ({
        ...state,
        faqs: { ...state.faqs, [id]: { ...state.faqs[id], ...params } },
      }))
      await prepareFaqUpdate(id, params)
    },
    async searchFaqs(query: string) {
      const { data } = await fetcher.get<Faq[]>(`/faq`, { params: { q: query } })

      const faqs = data.map((faq) => ({
        ...faq,
        id: faq.id.toString(),
      }))

      const ids = faqs.map((faq) => faq.id)
      const entities = keyBy((faq) => faq.id, faqs)

      set((state) => ({ faqs: { ...state.faqs, ...entities } }))
      return { ids }
    },
  })),
)

export default useFaqStore
