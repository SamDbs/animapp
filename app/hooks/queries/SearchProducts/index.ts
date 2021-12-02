import { useLazyQuery } from '@apollo/client'

import SEARCH_INGREDIENTS from './query'

export type Product = {
  id: string
  name: string
  description: string
  image: string
  brand: {
    id: string
    name: string
  }
}

type QueryReturnType = {
  products: Product[]
}

type QueryVariables = { q: string }

export default function useSearchProducts() {
  return useLazyQuery<QueryReturnType, QueryVariables>(SEARCH_INGREDIENTS)
}
