import useAuthStore from '@hooks/stores/auth'
import axios, { AxiosRequestConfig } from 'axios'
import Constants from 'expo-constants'

export default function createFetcher(jwt?: string) {
  const config: AxiosRequestConfig = {
    baseURL: Constants.manifest?.extra?.API_URL,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 401,
  }

  if (jwt) config.headers = { Authorization: jwt }

  const axiosInstance = axios.create(config)

  axiosInstance.interceptors.response.use(async (response) => {
    if (response.status === 401) {
      await useAuthStore.getState().logout()
      throw new axios.Cancel('Logged out.')
    }
    return response
  })

  return axiosInstance
}
