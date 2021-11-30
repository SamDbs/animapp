import { useLazyQuery } from '@apollo/client'

import GET_PRODUCT from './query'

type QueryReturnType = {
  product: {
    id: string
  }
}

type QueryVariables = { barCode: string }

export default function useGetProductByBarCode() {
  return useLazyQuery<QueryReturnType, QueryVariables>(GET_PRODUCT)
}
