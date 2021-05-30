import { devtools } from 'zustand/middleware'
import create from 'zustand'
import { debounce, keyBy, omit } from 'lodash/fp'

import { fetcher } from './index'

export type Ingredient = {
  id: string
  image: string
  name: string
  description: string
  review: string
}

let combinedIngredientUpdate = {}
async function prepareIngredientUpdate(id: Ingredient['id'], params: Partial<Ingredient>) {
  combinedIngredientUpdate = { ...combinedIngredientUpdate, ...params }
  await sendIngredientCombinedUpdateDebounce(id, combinedIngredientUpdate)
}
const sendIngredientCombinedUpdateDebounce = debounce(
  1000,
  async (id: Ingredient['id'], params: Partial<Ingredient>) => {
    await fetcher.patch(`/ingredients/${id}`, params)
    combinedIngredientUpdate = {}
  },
)

export type IngredientStoreState = {
  ingredients: Record<Ingredient['id'], Ingredient>
  usedIngredientIds: Record<Ingredient['id'], number>
  registerIds: (ids: Ingredient['id'][]) => void
  unregisterIds: (ids: Ingredient['id'][]) => void
  getIngredientById: (id: Ingredient['id']) => Promise<{ id: Ingredient['id'] }>
  getIngredients: () => Promise<{ ids: Ingredient['id'][] }>
  updateIngredient: (id: Ingredient['id'], params: Partial<Ingredient>) => Promise<void>
  searchIngredients: (query: string) => Promise<{ ids: Ingredient['id'][] }>
  createIngredient: () => Promise<unknown>
}

const useIngredientsStore = create<IngredientStoreState>(
  devtools((set) => ({
    ingredients: {},
    usedIngredientIds: {},
    registerIds(ids: Ingredient['id'][]) {
      set((state) => {
        const update: Record<Ingredient['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedIngredientIds ? state.usedIngredientIds[id] + 1 : 1,
          }),
          {},
        )

        const newState = {
          ...state,
          usedIngredientIds: { ...state.usedIngredientIds, ...update },
        }

        const idsToDelete = Object.entries(newState.usedIngredientIds)
          .filter(([, value]) => value < 1)
          .map(([key]) => key)

        const finalState = {
          ...newState,
          ingredients: omit(idsToDelete, newState.ingredients),
          usedIngredientIds: omit(idsToDelete, newState.usedIngredientIds),
        }
        return finalState
      })
    },
    unregisterIds(ids: Ingredient['id'][]) {
      set((state) => {
        const update: Record<Ingredient['id'], number> = ids.reduce(
          (acc, id) => ({
            ...acc,
            [id]: id in state.usedIngredientIds ? state.usedIngredientIds[id] - 1 : 0,
          }),
          {},
        )
        const newState = {
          ...state,
          usedIngredientIds: { ...state.usedIngredientIds, ...update },
        }
        return newState
      })
    },
    async getIngredientById(id: string) {
      const { data } = await fetcher.get<Ingredient>(`/ingredients/${id}`)
      const ingredient = { ...data, id: data.id.toString() }

      set((state) => ({ ingredients: { ...state.ingredients, [ingredient.id]: ingredient } }))
      return { id }
    },
    async getIngredients() {
      const { data } = await fetcher.get<Ingredient[]>(`/ingredients`)

      const ingredients = data.map((ingredient) => ({
        ...ingredient,
        id: ingredient.id.toString(),
      }))

      const ids = ingredients.map((ingredient) => ingredient.id)
      const entities = keyBy((ingredient) => ingredient.id, ingredients)

      set((state) => ({ ingredients: { ...state.ingredients, ...entities } }))
      return { ids }
    },
    async updateIngredient(id: Ingredient['id'], params: Partial<Ingredient>) {
      set((state) => ({
        ...state,
        ingredients: { ...state.ingredients, [id]: { ...state.ingredients[id], ...params } },
      }))
      await prepareIngredientUpdate(id, params)
    },
    async searchIngredients(query: string) {
      const { data } = await fetcher.get<Ingredient[]>(`/ingredients`, { params: { q: query } })

      const ingredients = data.map((ingredient) => ({
        ...ingredient,
        id: ingredient.id.toString(),
      }))

      const ids = ingredients.map((ingredient) => ingredient.id)
      const entities = keyBy((ingredient) => ingredient.id, ingredients)

      set((state) => ({ ingredients: { ...state.ingredients, ...entities } }))
      return { ids }
    },
    createIngredient() {
      return fetcher.post(`/ingredients`)
    },
  })),
)

export default useIngredientsStore
