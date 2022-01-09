import { keyBy, omit } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'
import { Product } from './product'

export type Ingredient = {
  id: string
  image: string
  name: string
  description: string
  review: string
  rating: string
}

export type ProductIngredient = {
  productId: string
  ingredientId: string
  quantity: string
  order?: number
}

export type IngredientStore = {
  ingredients: Record<Ingredient['id'], Ingredient>
  usedIngredientIds: Record<Ingredient['id'], number>
  productIngredients: Record<string, Partial<ProductIngredient>>
  registerIds: (ids: Ingredient['id'][]) => void
  unregisterIds: (ids: Ingredient['id'][]) => void
  guessIngredients: (query: string) => Promise<{ ids: Ingredient['id'][] }>
  setIngredientsOrder: (
    product: Product['id'],
    newOrders: { ownedEntityId: string; order: number }[],
  ) => Promise<void>
}

const useIngredientsStore = create<IngredientStore>(
  devtools(
    (set) => ({
      ingredients: {},
      usedIngredientIds: {},
      productIngredients: {},
      registerIds(ids) {
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
      unregisterIds(ids) {
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
      async guessIngredients(query) {
        const { data } = await fetcher.get<
          { ingredientSearched: string; ingredientFound: Ingredient }[]
        >('/search/ingredients', { params: { q: query } })

        const ingredients = data
          .filter((item) => item.ingredientFound)
          .map((item) => item.ingredientFound)
          .map((ingredient) => ({
            ...ingredient,
            id: ingredient.id.toString(),
          }))

        const ids = ingredients.map((ingredient) => ingredient.id)
        const entities = keyBy((ingredient) => ingredient.id, ingredients)

        set((state) => ({ ingredients: { ...state.ingredients, ...entities } }))
        return { ids }
      },
      async setIngredientsOrder(productId, orders): Promise<void> {
        const newOrders = orders.map((o) => ({
          productId,
          ingredientId: o.ownedEntityId,
          order: o.order,
        }))
        set((state) => ({
          ...state,
          productIngredients: {
            ...state.productIngredients,
            ...newOrders.reduce((acc, cur) => {
              const key = `${productId}-${cur.ingredientId}`
              return { ...acc, [key]: { ...state.productIngredients[key], order: cur.order } }
            }, {}),
          },
        }))
        await fetcher.put<void>(`/products/${productId}/ingredients/order`, newOrders)
      },
    }),
    { name: 'ingredient' },
  ),
)

export default useIngredientsStore
