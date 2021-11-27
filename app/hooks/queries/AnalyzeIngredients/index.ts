import { useLazyQuery } from '@apollo/client'

import ANALYZE_INGREDIENTS from './query'

export type IngredientFound = { id: string; name: string; review: string; rating: number }

type QueryReturnType = {
  analyzeIngredients: {
    ingredientSearched: string
    ingredientFound: IngredientFound
  }[]
}

type QueryVariables = { q: string }

export default function useAnalyzeIngredients() {
  return useLazyQuery<QueryReturnType, QueryVariables>(ANALYZE_INGREDIENTS)
}
