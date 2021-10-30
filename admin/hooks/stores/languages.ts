import { keyBy, debounce } from 'lodash/fp'
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
  createLanguage: (params: { id: string; name: string }) => Promise<unknown>
  getAllLanguages: () => Promise<{ ids: Language['id'][] }>
  getLanguageById: (id: Language['id']) => Promise<{ id: Language['id'] }>
  updateLanguage: (id: Language['id'], params: Partial<Language>) => Promise<void>
}

const useLanguagesStore = create<LanguageStoreState>(
  devtools(
    (set, get) => ({
      languages: {},
      async createLanguage(params) {
        return fetcher.post(`/languages`, params)
      },
      async getAllLanguages() {
        const { data } = await fetcher.get<Product[]>(`/languages`)

        const languages = data.map((lang) => ({ ...lang, id: lang.id.toString() }))

        const ids = languages.map((lang) => lang.id)
        const entities = keyBy((lang) => lang.id, languages)

        set((state) => ({ ...state, languages: { ...state.languages, ...entities } }))
        return { ids }
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
    }),
    'language',
  ),
)

export default useLanguagesStore
