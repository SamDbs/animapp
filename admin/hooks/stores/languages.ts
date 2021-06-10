import { keyBy, omit, debounce } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'
import { Product } from './product'

export type Language = {
  id: string
  name: string
}

let combinedLanguageUpdates = {}
async function prepareIngredientUpdate(id: Language['id'], params: Partial<Language>) {
  combinedLanguageUpdates = { ...combinedLanguageUpdates, ...params }
  await sendLanguageCombinedUpdateDebounced(id, combinedLanguageUpdates)
}
const sendLanguageCombinedUpdateDebounced = debounce(
  1000,
  async (id: Language['id'], params: Partial<Language>) => {
    await fetcher.patch(`/languages/${id}`, params)
    combinedLanguageUpdates = {}
  },
)

type LanguageStoreState = {
  languages: Record<Language['id'], Language>
  usedLanguageIds: Record<Language['id'], number>
  registerIds: (ids: Language['id'][]) => void
  unregisterIds: (ids: Language['id'][]) => void
  getLanguageById: (id: Language['id']) => Promise<{ id: Language['id'] }>
  updateLanguage: (id: Language['id'], params: Partial<Language>) => Promise<void>
  getAllLanguages: () => Promise<{ ids: Language['id'][] }>
  createLanguage: (params: { id: string; name: string }) => Promise<unknown>
}

const useLanguagesStore = create<LanguageStoreState>(
  devtools(
    (set, get) => ({
      languages: {},
      usedLanguageIds: {},
      registerIds(ids: Language['id'][]) {
        set((state) => {
          const update: Record<Language['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedLanguageIds ? state.usedLanguageIds[id] + 1 : 1,
            }),
            {},
          )

          const newState = {
            ...state,
            usedLanguageIds: { ...state.usedLanguageIds, ...update },
          }

          const idsToDelete = Object.entries(newState.usedLanguageIds)
            .filter(([, value]) => value < 1)
            .map(([key]) => key)

          const finalState = {
            ...newState,
            languages: omit(idsToDelete, newState.languages),
            usedLanguageIds: omit(idsToDelete, newState.usedLanguageIds),
          }
          return finalState
        })
      },
      unregisterIds(ids: Language['id'][]) {
        set((state) => {
          const update: Record<Language['id'], number> = ids.reduce(
            (acc, id) => ({
              ...acc,
              [id]: id in state.usedLanguageIds ? state.usedLanguageIds[id] - 1 : 0,
            }),
            {},
          )
          const newState = {
            ...state,
            usedLanguageIds: { ...state.usedLanguageIds, ...update },
          }
          return newState
        })
      },
      async getLanguageById(id) {
        const { data } = await fetcher.get<Language>(`/languages/${id}`)
        const language = { ...data, id: data.id.toString() }

        set((state) => ({ languages: { ...state.languages, [language.id]: language } }))
        return { id }
      },
      async updateLanguage(id, params) {
        set((state) => ({
          ...state,
          languages: { ...state.languages, [id]: { ...state.languages[id], ...params } },
        }))
        await prepareIngredientUpdate(id, params)
      },
      async getAllLanguages() {
        const { data } = await fetcher.get<Product[]>(`/languages`)

        const languages = data.map((lang) => ({ ...lang, id: lang.id.toString() }))

        const ids = languages.map((lang) => lang.id)
        const entities = keyBy((lang) => lang.id, languages)

        set((state) => ({ ...state, languages: { ...state.languages, ...entities } }))
        return { ids }
      },
      async createLanguage(params) {
        return fetcher.post(`/languages`, params)
      },
    }),
    'language',
  ),
)

export default useLanguagesStore
