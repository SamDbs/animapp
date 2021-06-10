import { AxiosRequestConfig } from 'axios'
import { debounce, keyBy } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import type { Constituent } from './constituent'
import { fetcher } from './index'
import type { Language } from './languages'

export type ConstituentTranslation = {
  id: string
  analyticalConstituentId: Constituent['id']
  languageId: Language['id']
  description: string
  name: string
}

export type ConstituentTranslationStore = {
  constituentTranslations: Record<string, Partial<ConstituentTranslation>>
  creatingIds: string[]
  getConstituentTranslations: (
    constituentId: Constituent['id'],
  ) => Promise<{ ids: ConstituentTranslation['id'][] }>
  updateConstituentTranslation: (
    constituentId: Constituent['id'],
    languageId: Language['id'],
    params: Partial<ConstituentTranslation>,
  ) => Promise<void>
  createConstituentTranslation: (
    constituentId: Constituent['id'],
    languageId: Language['id'],
    description: string,
    name: string,
  ) => Promise<void>
}

let combinedConstituentTranslationsUpdate: Record<
  ConstituentTranslation['languageId'],
  Partial<ConstituentTranslation>
> = {}

async function prepareConstituentTranslationsUpdate(
  constituentId: Constituent['id'],
  languageId: Language['id'],
  params: Partial<ConstituentTranslation>,
  method: AxiosRequestConfig['method'],
) {
  combinedConstituentTranslationsUpdate = {
    ...combinedConstituentTranslationsUpdate,
    [languageId]: {
      ...combinedConstituentTranslationsUpdate[languageId],
      ...params,
    },
  }
  if (method === 'post') {
    await sendConstituentTranslationUpdate(constituentId, method)
    return
  }
  await sendConstituentTranslationUpdateDebounced(constituentId, method)
}
const sendConstituentTranslationUpdate = async (
  constituentId: Constituent['id'],
  method: AxiosRequestConfig['method'],
) => {
  await Promise.all(
    Object.keys(combinedConstituentTranslationsUpdate).map((key) =>
      method === 'post'
        ? fetcher(`/analyticalConstituents/${constituentId}/translations`, {
            method,
            data: { languageId: key, ...combinedConstituentTranslationsUpdate[key] },
          })
        : fetcher(`/analyticalConstituents/${constituentId}/translations/${key}`, {
            method,
            data: combinedConstituentTranslationsUpdate[key],
          }),
    ),
  )
  combinedConstituentTranslationsUpdate = {}
}
const sendConstituentTranslationUpdateDebounced = debounce(1000, sendConstituentTranslationUpdate)

const useConstituentTranslationStore = create<ConstituentTranslationStore>(
  devtools(
    (set, get) => ({
      constituentTranslations: {},
      creatingIds: [],
      async getConstituentTranslations(constituentId: Constituent['id']) {
        const { data } = await fetcher.get<ConstituentTranslation[]>(
          `/analyticalConstituents/${constituentId}/translations`,
        )
        const translations = data.map((translation) => ({
          ...translation,
          id: `${translation.analyticalConstituentId.toString()}-${translation.languageId.toString()}`,
        }))

        const ids = translations.map((translation) => translation.id)
        const entities = keyBy((translation) => translation.id, translations)

        set((state) => ({
          constituentTranslations: { ...state.constituentTranslations, ...entities },
        }))
        return { ids }
      },
      async updateConstituentTranslation(
        constituentIdId: Constituent['id'],
        languageId: Language['id'],
        params: Partial<ConstituentTranslation>,
      ) {
        const id = `${constituentIdId}-${languageId}`
        if (!get().constituentTranslations[id]) {
          set((state) => ({
            constituentTranslations: {
              ...state.constituentTranslations,
              [id]: { ...params, languageId, constituentIdId } as any,
            },
            creatingIds: [...state.creatingIds, id],
          }))
          await prepareConstituentTranslationsUpdate(constituentIdId, languageId, params, 'post')
          set((state) => ({
            constituentTranslations: {
              ...state.constituentTranslations,
              [id]: { ...state.constituentTranslations[id] } as any,
            },
            creatingIds: state.creatingIds.filter((currentId) => currentId !== id),
          }))
          return
        }
        if (get().creatingIds.includes(id)) return
        set((state) => ({
          constituentTranslations: {
            ...state.constituentTranslations,
            [id]: {
              ...state.constituentTranslations[id],
              ...params,
            },
          },
        }))
        await prepareConstituentTranslationsUpdate(constituentIdId, languageId, params, 'patch')
      },
      async createConstituentTranslation() {},
    }),
    'constituent translation',
  ),
)

export default useConstituentTranslationStore
