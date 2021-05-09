import { combine } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import create from 'zustand'

export const useAuthStore = create(
  combine({ jwt: '' as string }, (set) => ({
    async login({ login, password }: { login: string; password: string }) {
      const { data } = await axios.post(`${process.env.API_URL}/auth`, { login, password })
      const { jwt } = data

      await AsyncStorage.setItem('jwt', jwt)

      return set({ jwt })
    },
    setJwt: (jwt: string) => set({ jwt }),
  })),
)

export type Product = {
  id: string
}

export const useProductsStore = create(
  combine({ products: {} as Record<Product['id'], Product> }, (set) => ({
    addProduct(product: Product) {
      set((state) => ({ products: { ...state.products, [product.id]: product } }))
    },
    async getProducts() {
      const { jwt } = useAuthStore.getState()
      const { data } = await axios.get<Product[]>(`${process.env.API_URL}/products`, {
        headers: { Authorization: jwt },
      })
      const ids = data.map((product: any) => product.id) as any[]
      const entities = data.reduce((r: any, x: any) => ({ ...r, [x['id']]: x }), {})
      set((state) => ({ products: { ...state.products, ...entities } }))
      return { ids }
    },
    async searchProducts(params: Record<string, any>) {
      const { jwt } = useAuthStore.getState()
      const { data } = await axios.get<Product[]>(`${process.env.API_URL}/products`, {
        headers: { Authorization: jwt },
        params,
      })
      const ids = data.map((product) => product.id) as any[]
      const entities = data.reduce((r: any, x: any) => ({ ...r, [x['id']]: x }), {})
      set((state) => ({ products: { ...state.products, ...entities } }))
      return { ids }
    },
    createProduct(params: { barCode: string; name: string; type: string }) {
      const { jwt } = useAuthStore.getState()
      return axios.post(`${process.env.API_URL}/products`, params, {
        headers: { Authorization: jwt },
      })
    },
  })),
)
