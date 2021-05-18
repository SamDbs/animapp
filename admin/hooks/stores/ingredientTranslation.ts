import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { debounce, keyBy } from 'lodash/fp'

import { fetcher } from './index'
import type { Language } from './languages'
import type { Ingredient } from './ingredient'
import { AxiosInstance, AxiosRequestConfig } from 'axios'

export type IngredientTranslation = {
  id: string
  ingredientId: Ingredient['id']
  languageId: Ingredient['id']
  description: string
  review: string
  name: string
}

export type IngredientTranslationStore = {
  ingredientTranslations: Record<string, Partial<IngredientTranslation>>
  getIngredientTranslations: (
    ingredientId: Ingredient['id'],
  ) => Promise<{ ids: IngredientTranslation['id'][] }>
  updateIngredientTranslation: (
    ingredientId: Ingredient['id'],
    languageId: Language['id'],
    params: Partial<IngredientTranslation>,
  ) => Promise<void>
  createIngredientTranslation: (
    ingredientId: Ingredient['id'],
    languageId: Language['id'],
    description: string,
  ) => Promise<void>
}

let combinedIngredientTranslationsUpdate: Record<
  IngredientTranslation['languageId'],
  Partial<IngredientTranslation>
> = {}

async function prepareIngredientTranslationsUpdate(
  ingredientId: Ingredient['id'],
  languageId: Language['id'],
  params: Partial<IngredientTranslation>,
  method: AxiosRequestConfig['method'],
) {
  combinedIngredientTranslationsUpdate = {
    ...combinedIngredientTranslationsUpdate,
    [languageId]: {
      ...combinedIngredientTranslationsUpdate[languageId],
      ...params,
    },
  }
  await sendIngredientTranslationUpdateDebounced(ingredientId, method)
}

const sendIngredientTranslationUpdateDebounced = debounce(
  1000,
  async (ingredientId: Ingredient['id'], method: AxiosRequestConfig['method']) => {
    await Promise.all(
      Object.keys(combinedIngredientTranslationsUpdate).map((key) =>
        method === 'post'
          ? fetcher(`/ingredients/${ingredientId}/translations`, {
              method,
              data: { languageId: key, ...combinedIngredientTranslationsUpdate[key] },
            })
          : fetcher(`/ingredients/${ingredientId}/translations/${key}`, {
              method,
              data: combinedIngredientTranslationsUpdate[key],
            }),
      ),
    )
    combinedIngredientTranslationsUpdate = {}
  },
)

const useIngredientTranslationStore = create<IngredientTranslationStore>(
  devtools((set, get) => ({
    ingredientTranslations: {},
    async getIngredientTranslations(ingredientId: Ingredient['id']) {
      const { data } = await fetcher.get<IngredientTranslation[]>(
        `/ingredients/${ingredientId}/translations`,
      )

      const translations = data.map((translation) => ({
        ...translation,
        id: `${translation.ingredientId.toString()}-${translation.languageId.toString()}`,
      }))

      const ids = translations.map((translation) => translation.id)
      const entities = keyBy((translation) => translation.id, translations)

      set((state) => ({ ingredientTranslations: { ...state.ingredientTranslations, ...entities } }))
      return { ids }
    },
    async updateIngredientTranslation(
      ingredientId: Ingredient['id'],
      languageId: Language['id'],
      params: Partial<IngredientTranslation>,
    ) {
      const id = `${ingredientId}-${languageId}`
      if (!get().ingredientTranslations[id]) {
        set((state) => ({
          ingredientTranslations: { ...state.ingredientTranslations, [id]: {...params, languageId, ingredientId
          } as any },
        }))

        await prepareIngredientTranslationsUpdate(ingredientId, languageId, params, 'post')
        return
      }
      set((state) => ({
        ingredientTranslations: {
          ...state.ingredientTranslations,
          [`${ingredientId}-${languageId}`]: {
            ...state.ingredientTranslations[`${ingredientId}-${languageId}`],
            ...params,
          },
        },
      }))
      await prepareIngredientTranslationsUpdate(ingredientId, languageId, params, 'patch')
    },
    async createIngredientTranslation() {},
  })),
)

export default useIngredientTranslationStore
