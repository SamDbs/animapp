import AsyncStorage from '@react-native-async-storage/async-storage'
import createFetcher from '@utils/createFetcher'
import create from 'zustand'
import { combine, devtools } from 'zustand/middleware'

import { fetcher, setFetcher } from './index'

const useAuthStore = create(
  devtools(
    combine({ jwt: '' as string }, (set) => ({
      async login({ login, password }: { login: string; password: string }) {
        const { data } = await fetcher.post(`/auth`, { login, password })
        const { jwt } = data

        await AsyncStorage.setItem('jwt', jwt)
        return set({ jwt })
      },
      async loginUsingAsyncStorage() {
        const jwt = await AsyncStorage.getItem('jwt')

        if (jwt) return set({ jwt })
        else return set({ jwt: '' })
      },
      async logout() {
        await AsyncStorage.removeItem('jwt')
        return set({ jwt: '' })
      },
    })),
  ),
)

useAuthStore.subscribe(
  (jwt: string) => {
    setFetcher(createFetcher(jwt))
  },
  (state) => state.jwt,
)

export default useAuthStore
