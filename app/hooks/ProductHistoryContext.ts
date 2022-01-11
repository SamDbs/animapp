import { createContext } from 'react'

const ProductHistoryContext = createContext<{
  historyProductsIds: string[]
  removeProduct: any
  viewProduct: any
}>({
  historyProductsIds: [],
  removeProduct: () => null,
  viewProduct: () => null,
})

export default ProductHistoryContext
