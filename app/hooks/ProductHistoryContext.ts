import { createContext } from 'react'

const ProductHistoryContext = createContext<{
  historyProductsIds: number[]
  viewProduct: any
}>({
  historyProductsIds: [],
  viewProduct: () => null,
})

export default ProductHistoryContext
