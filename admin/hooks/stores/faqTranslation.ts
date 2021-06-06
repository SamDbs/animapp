import { AxiosRequestConfig } from 'axios'
import { debounce, keyBy } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import type { Faq } from './faq'
import { fetcher } from './index'
import type { Language } from './languages'

export type FaqTranslation = {
  id: string
  faqId: Faq['id']
  languageId: Language['id']
  question: string
  answer: string
}

export type FaqTranslationStore = {
  faqTranslations: Record<string, Partial<FaqTranslation>>
  getFaqTranslations: (faqId: Faq['id']) => Promise<{ ids: FaqTranslation['id'][] }>
  updateFaqTranslation: (
    faqId: Faq['id'],
    languageId: Language['id'],
    params: Partial<FaqTranslation>,
  ) => Promise<void>
  createFaqTranslation: (
    faqId: Faq['id'],
    languageId: Language['id'],
    question: string,
    answer: string,
  ) => Promise<void>
}

let combinedFaqTranslationsUpdate: Record<FaqTranslation['languageId'], Partial<FaqTranslation>> =
  {}

async function prepareFaqTranslationsUpdate(
  faqId: Faq['id'],
  languageId: Language['id'],
  params: Partial<FaqTranslation>,
  method: AxiosRequestConfig['method'],
) {
  combinedFaqTranslationsUpdate = {
    ...combinedFaqTranslationsUpdate,
    [languageId]: {
      ...combinedFaqTranslationsUpdate[languageId],
      ...params,
    },
  }
  await sendFaqTranslationUpdateDebounced(faqId, method)
}

const sendFaqTranslationUpdateDebounced = debounce(
  1000,
  async (faqId: Faq['id'], method: AxiosRequestConfig['method']) => {
    await Promise.all(
      Object.keys(combinedFaqTranslationsUpdate).map((key) =>
        method === 'post'
          ? fetcher(`/faq/${faqId}/translations`, {
              method,
              data: { languageId: key, ...combinedFaqTranslationsUpdate[key] },
            })
          : fetcher(`/faq/${faqId}/translations/${key}`, {
              method,
              data: combinedFaqTranslationsUpdate[key],
            }),
      ),
    )
    combinedFaqTranslationsUpdate = {}
  },
)

const useFaqTranslationStore = create<FaqTranslationStore>(
  devtools((set, get) => ({
    faqTranslations: {},
    async getFaqTranslations(faqId: Faq['id']) {
      const { data } = await fetcher.get<FaqTranslation[]>(`/faq/${faqId}/translations`)

      const translations = data.map((translation) => ({
        ...translation,
        id: `${translation.faqId.toString()}-${translation.languageId.toString()}`,
      }))

      const ids = translations.map((translation) => translation.id)
      const entities = keyBy((translation) => translation.id, translations)

      set((state) => ({ faqTranslations: { ...state.faqTranslations, ...entities } }))
      return { ids }
    },
    async updateFaqTranslation(
      faqId: Faq['id'],
      languageId: Language['id'],
      params: Partial<FaqTranslation>,
    ) {
      const id = `${faqId}-${languageId}`
      if (!get().faqTranslations[id]) {
        set((state) => ({
          faqTranslations: {
            ...state.faqTranslations,
            [id]: { ...params, languageId, faqId } as any,
          },
        }))

        await prepareFaqTranslationsUpdate(faqId, languageId, params, 'post')
        return
      }
      set((state) => ({
        faqTranslations: {
          ...state.faqTranslations,
          [`${faqId}-${languageId}`]: {
            ...state.faqTranslations[`${faqId}-${languageId}`],
            ...params,
          },
        },
      }))
      await prepareFaqTranslationsUpdate(faqId, languageId, params, 'patch')
    },
    async createFaqTranslation() {},
  })),
)

export default useFaqTranslationStore
