import { PaginationDetails } from '@hooks/useSearchableList'
import { keyBy, omit } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'

export type Faq = {
  id: string
  question: string
  answer: string
}

export type FaqStoreState = {
  faqs: Record<Faq['id'], Faq>
  usedFaqIds: Record<Faq['id'], number>
  registerIds: (ids: Faq['id'][]) => void
  unregisterIds: (ids: Faq['id'][]) => void
  getFaqById: (id: Faq['id']) => Promise<{ id: Faq['id'] }>
  searchFaqs: (
    query: string,
    page?: number,
  ) => Promise<{ ids: Faq['id'][]; pagination: PaginationDetails }>
  createFaq: () => Promise<unknown>
}

const useFaqStore = create<FaqStoreState>(
  devtools(
    (set) => ({
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
      async searchFaqs(query: string, page = 0) {
        const { data } = await fetcher.get<{ faqs: Faq[]; pagination: PaginationDetails }>(`/faq`, {
          params: { q: query, page },
        })

        const faqs = data.faqs.map((faq) => ({
          ...faq,
          id: faq.id.toString(),
        }))

        const ids = faqs.map((faq) => faq.id)
        const entities = keyBy((faq) => faq.id, faqs)

        set((state) => ({ faqs: { ...state.faqs, ...entities } }))
        return { ids, pagination: data.pagination }
      },
      createFaq() {
        return fetcher.post(`/faq`)
      },
    }),
    'faq',
  ),
)

export default useFaqStore
