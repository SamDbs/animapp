import { useQuery } from '@apollo/client'

import query from './query'

type QueryReturnType = {
  product: {
    id: string
    description: string
    image: string
    name: string
    type: string
    brand: {
      id: string
      name: string
    }
  }
}

type QueryVariables = { id: string }

export default function useGetProductFromHistory(id: string) {
  return useQuery<QueryReturnType, QueryVariables>(query, { variables: { id } })
}
