import create from 'zustand'
import { devtools } from 'zustand/middleware'

export type ProductConstituent = {
  productId: string
  constituentId: string
  quantity: string
}

export type ProductConstituentStore = {
  productConstituents: Record<string, Partial<ProductConstituent>>
}

const useProductConstituentsStore = create<ProductConstituentStore>(
  devtools(
    (set, get) => ({
      productConstituents: {},
    }),
    'productConstituent',
  ),
)

export default useProductConstituentsStore
