import { createContext } from 'react'

const ProductHistoryContext = createContext<{
  historyProductsIds: string[]
  viewProduct: any
}>({
  historyProductsIds: [],
  viewProduct: () => null,
})

export default ProductHistoryContext
