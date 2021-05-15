import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { keyBy } from 'lodash/fp'

import { fetcher } from './index'
import { Product } from './product'

export type Language = {
  id: string
  name: string
}

type LanguageStoreState = {
  languages: Record<Language['id'], Language>
  getAllLanguages: () => Promise<{ ids: Language['id'][] }>
}

const useLanguagesStore = create<LanguageStoreState>(
  devtools((set, get) => ({
    languages: {},
    async getAllLanguages() {
      const { data } = await fetcher.get<Product[]>(`/languages`)

      const languages = data.map((lang) => ({ ...lang, id: lang.id.toString() }))

      const ids = languages.map((lang) => lang.id)
      const entities = keyBy((lang) => lang.id, languages)

      set((state) => ({ languages: { ...state.languages, ...entities } }))
      return { ids }
    },
  })),
)

export default useLanguagesStore
