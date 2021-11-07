import { useQuery } from '@apollo/client'

import GET_PRODUCT_CONSTITUENTS from './query'

export type Constituent = {
  description: string
  id: string
  name: string
}

export type QueryReturnType = {
  productConstituents: {
    quantity: number
    order: number
    constituent: Constituent
  }[]
}

export type QueryVariables = { productId: string }

export default function useGetProductConstituents(productId: string) {
  return useQuery<QueryReturnType, QueryVariables>(GET_PRODUCT_CONSTITUENTS, {
    variables: { productId },
  })
}
