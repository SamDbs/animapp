import { PaginationDetails } from '@hooks/useSearchableList'
import { debounce, keyBy, omit } from 'lodash/fp'
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

export type IngredientStore = {
  ingredients: Record<Ingredient['id'], Ingredient>
  usedIngredientIds: Record<Ingredient['id'], number>
  productIngredients: Record<string, Partial<ProductIngredient>>
  registerIds: (ids: Ingredient['id'][]) => void
  unregisterIds: (ids: Ingredient['id'][]) => void
  getIngredientById: (id: Ingredient['id']) => Promise<{ id: Ingredient['id'] }>
  updateIngredient: (id: Ingredient['id'], params: Partial<Ingredient>) => Promise<void>
  searchIngredients: (
    query: string,
    page?: number,
  ) => Promise<{ pagination: PaginationDetails; ids: Ingredient['id'][] }>
  createIngredient: () => Promise<Product['id']>
  getIngredientsByProductId: (productId: Product['id']) => Promise<{ ids: Ingredient['id'][] }>
  updateIngredientsByProductId: (
    productId: Product['id'],
    ingredientId: Ingredient['id'],
    param?: string,
  ) => Promise<void>
  deleteIngredientFromProductId: (
    productId: Product['id'],
    ingredientId: Ingredient['id'],
  ) => Promise<void>
  guessIngredients: (query: string) => Promise<{ ids: Ingredient['id'][] }>
}

const useIngredientsStore = create<IngredientStore>(
  devtools(
    (set) => ({
      ingredients: {},
      usedIngredientIds: {},
      productIngredients: {},
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
      async updateIngredient(id: Ingredient['id'], params: Partial<Ingredient>) {
        set((state) => ({
          ...state,
          ingredients: { ...state.ingredients, [id]: { ...state.ingredients[id], ...params } },
        }))
        await prepareIngredientUpdate(id, params)
      },
      async searchIngredients(query: string, page = 0) {
        const { data } = await fetcher.get<{
          pagination: PaginationDetails
          ingredients: Ingredient[]
        }>(`/ingredients`, {
          params: { q: query, page },
        })

        const ingredients = data.ingredients.map((ingredient) => ({
          ...ingredient,
          id: ingredient.id.toString(),
        }))

        const ids = ingredients.map((ingredient) => ingredient.id)
        const entities = keyBy((ingredient) => ingredient.id, ingredients)

        set((state) => ({ ingredients: { ...state.ingredients, ...entities } }))
        return { pagination: data.pagination, ids }
      },
      async createIngredient() {
        const { data: ingredient } = await fetcher.post<Ingredient>(`/ingredients`)
        return ingredient.id
      },
      async getIngredientsByProductId(productId) {
        const { data } = await fetcher.get<{
          ingredients: Ingredient[]
          relations: ProductIngredient[]
        }>(`/products/${productId}/ingredients`)

        const ingredients = data.ingredients.map((ingredient) => ({
          ...ingredient,
          id: ingredient.id.toString(),
        }))

        const relations = data.relations.map((relation) => ({
          ...relation,
          id: `${relation.productId.toString()}-${relation.ingredientId.toString()}`,
        }))

        const ids = ingredients.map((ingredient) => ingredient.id)
        const entities = keyBy((ingredient) => ingredient.id, ingredients)

        set((state) => ({
          ...state,
          productIngredients: keyBy((relation) => relation.id, relations),

          ingredients: { ...state.ingredients, ...entities },
        }))

        return { ids }
      },
      async updateIngredientsByProductId(productId, ingredientId, param = '') {
        await fetcher.put<Ingredient[]>(`/products/${productId}/ingredients/${ingredientId}`, {
          quantity: param,
        })
        set((state) => ({
          ...state,
          productIngredients: {
            ...state.productIngredients,
            [`${productId.toString()}-${ingredientId.toString()}`]: {
              ingredientId,
              productId,
              quantity: param,
            },
          },
        }))
      },
      async deleteIngredientFromProductId(productId, ingredientId) {
        await fetcher.delete<Ingredient[]>(`/products/${productId}/ingredients/${ingredientId}`, {})
      },
      async guessIngredients(query: string) {
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
    }),
    'ingredient',
  ),
)

export default useIngredientsStore
