import { combine, devtools } from 'zustand/middleware'
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

const useIngredientsStore = create(
  devtools(
    combine(
      {
        ingredients: {} as Record<Ingredient['id'], Ingredient>,
        usedIngredientIds: {} as Record<Ingredient['id'], number>,
      },
      (set) => ({
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
        async updateIngredient(
          id: Ingredient['id'],
          params: {
            
            image?: string
          },
        ) {
          set((state) => ({
            ...state,
            ingredients: { ...state.ingredients, [id]: { ...state.ingredients[id], ...params } },
          }))
          await prepareIngredientUpdate(id, params)
        },
        async searchIngredients(q: string) {
          const { data } = await fetcher.get<Ingredient[]>(`/ingredients`, { params: { q } })

          const ingredients = data.map((ingredient) => ({
            ...ingredient,
            id: ingredient.id.toString(),
          }))

          const ids = ingredients.map((ingredient) => ingredient.id)
          const entities = keyBy((ingredient) => ingredient.id, ingredients)

          set((state) => ({ ingredients: { ...state.ingredients, ...entities } }))
          return { ids }
        },
        createIngredient(params: { image: string }) {
          return fetcher.post(`/ingredients`, params)
        },
      }),
    ),
  ),
)

export default useIngredientsStore
