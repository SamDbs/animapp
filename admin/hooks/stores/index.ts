import createFetcher from '@utils/createFetcher'
import { AxiosInstance } from 'axios'

export let fetcher = createFetcher()

export const setFetcher = (newValue: AxiosInstance) => {
  fetcher = newValue
}
