import { useQuery } from '@apollo/client'

import GET_PRODUCT from './query'

export type Ingredients = { ingredient: Ingredient }[]
export type Ingredient = {
  id: string
  name: string
  review: string
  description: string
  rating: number | null
}

export type Constituents = { constituent: Constituent }[]
export type Constituent = { name: string; description: string }

type QueryReturnType = {
  product: {
    id: string
    description: string
    image: string
    name: string
    type: string
    ingredients: Ingredients
    constituents: Constituents
  }
}

type QueryVariables = { id: string }

export default function useGetProduct(id: string) {
  return useQuery<QueryReturnType, QueryVariables>(GET_PRODUCT, { variables: { id } })
}
