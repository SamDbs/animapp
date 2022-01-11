import { useQuery } from '@apollo/client'
import { useContext } from 'react'

import ProductHistoryContext from '../../../hooks/ProductHistoryContext'
import query from './query'

type QueryReturnType = {
  product: {
    id: string
    image: string
    name: string
    published: boolean
    brand: {
      id: string
      name: string
    }
  }
}

type QueryVariables = { id: string }

export default function useGetProductFromHistory(id: string) {
  const { removeProduct } = useContext(ProductHistoryContext)
  const ret = useQuery<QueryReturnType, QueryVariables>(query, { variables: { id } })

  if (ret.data?.product && !ret.data?.product.published) {
    removeProduct(id)
  }
  
  return ret
}
