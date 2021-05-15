import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { debounce, keyBy } from 'lodash/fp'

import { fetcher } from './index'
import type { Language } from './languages'
import type { Ingredient } from './ingredient'

export type IngredientTranslation = {
  id: string
  productId: Ingredient['id']
  languageId: Ingredient['id']
  description: string
}

export type ProductTranslationStore = {
  ingredientTranslations: Record<string, Partial<IngredientTranslation>>
  getIngredientTranslations: (
    ingredientId: Ingredient['id'],
  ) => Promise<{ ids: IngredientTranslation['id'][] }>
  updateProductTranslation: (
    ingredientId: Ingredient['id'],
    languageId: Language['id'],
    params: Partial<IngredientTranslation>,
  ) => Promise<void>
  createProductTranslation: (
    ingredientId: Ingredient['id'],
    languageId: Language['id'],
    description: string,
  ) => Promise<void>
}

const useIngredientTranslationStore = create<ProductTranslationStore>({}) // TODO

export default useIngredientTranslationStore
