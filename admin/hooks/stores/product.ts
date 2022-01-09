import create from 'zustand'
import { devtools } from 'zustand/middleware'

export enum ProductType {
  DRY_FOOD = 'DRY_FOOD',
  TREATS = 'TREATS',
  WET_FOOD = 'WET_FOOD',
}

export type Product = {
  id: string
  name: string
  type: ProductType
  published: boolean
  image: string
  barCode: string
  description: string
  brand: string
}

export type ProductStore = {
  products: Record<Product['id'], Product>
  usedProductIds: Record<Product['id'], number>
  locallySetProductImage: (productId: Product['id'], image: string) => void
}

const useProductsStore = create<ProductStore>(
  devtools(
    (set, get) => ({
      products: {},
      usedProductIds: {},
      locallySetProductImage(productId: Product['id'], image: string) {
        if (!get().products[productId]) return
        set((state) => ({
          products: { ...state.products, [productId]: { ...state.products[productId], image } },
        }))
      },
    }),
    { name: 'product' },
  ),
)

export default useProductsStore
