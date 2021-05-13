import createFetcher from '@utils/createFetcher'
import { AxiosInstance } from 'axios'

export type TranslatedString = string

export type Product = {
  id: string
  name: string
  type: string
  image: string
  barCode: string
  description: TranslatedString
}

export type Language = {
  id: string
  name: string
}

export type ProductTranslation = {
  productId: Product['id']
  languageId: Product['id']
  description: string
}

export let fetcher = createFetcher()

export const setFetcher = (newValue: AxiosInstance) => {
  fetcher = newValue
}
