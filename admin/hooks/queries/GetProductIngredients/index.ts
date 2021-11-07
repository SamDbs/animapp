import { useQuery } from '@apollo/client'

import GET_PRODUCT_INGREDIENTS from './query'

export type Ingredient = {
  description: string
  id: string
  name: string
  review: string
}

export type QueryReturnType = {
  productIngredients: {
    quantity: number
    order: number
    ingredient: Ingredient
  }[]
}

export type QueryVariables = { productId: string }

export default function useGetProductIngredients(productId: string) {
  return useQuery<QueryReturnType, QueryVariables>(GET_PRODUCT_INGREDIENTS, {
    variables: { productId },
  })
}
