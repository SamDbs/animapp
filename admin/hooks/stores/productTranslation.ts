import { debounce, keyBy } from 'lodash/fp'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { fetcher } from './index'
import type { Language } from './languages'
import type { Product } from './product'

export type ProductTranslation = {
  id: string
  productId: Product['id']
  languageId: Product['id']
  description: string
}

let combinedProductTranslationsUpdate: Record<
  ProductTranslation['languageId'],
  Partial<ProductTranslation>
> = {}

async function prepareProductTranslationsUpdate(
  productId: Product['id'],
  languageId: Language['id'],
  params: Partial<ProductTranslation>,
) {
  combinedProductTranslationsUpdate = {
    ...combinedProductTranslationsUpdate,
    [languageId]: {
      ...combinedProductTranslationsUpdate[languageId],
      ...params,
    },
  }
  await sendProductTranslationUpdateDebounced(productId)
}
const sendProductTranslationUpdateDebounced = debounce(1000, async (productId: Product['id']) => {
  await Promise.all(
    Object.keys(combinedProductTranslationsUpdate).map((key) =>
      fetcher.patch(
        `/products/${productId}/translations/${key}`,
        combinedProductTranslationsUpdate[key],
      ),
    ),
  )
  combinedProductTranslationsUpdate = {}
})

export type ProductTranslationStore = {
  productTranslations: Record<string, Partial<ProductTranslation>>
  getProductTranslations: (productId: Product['id']) => Promise<{ ids: ProductTranslation['id'][] }>
  updateProductTranslation: (
    productId: Product['id'],
    languageId: Language['id'],
    params: Partial<ProductTranslation>,
  ) => Promise<void>
  createProductTranslation: (
    productId: Product['id'],
    languageId: Language['id'],
    description: string,
  ) => Promise<void>
}

const useProductTranslationStore = create<ProductTranslationStore>(
  devtools(
    (set, get) => ({
      productTranslations: {},
      async getProductTranslations(productId: Product['id']) {
        const { data } = await fetcher.get<ProductTranslation[]>(
          `/products/${productId}/translations`,
        )

        const translations = data.map((translation) => ({
          ...translation,
          id: `${translation.productId.toString()}-${translation.languageId.toString()}`,
        }))

        const ids = translations.map((translation) => translation.id)
        const entities = keyBy((translation) => translation.id, translations)

        set((state) => ({ productTranslations: { ...state.productTranslations, ...entities } }))
        return { ids }
      },
      async updateProductTranslation(
        productId: Product['id'],
        languageId: Language['id'],
        params: Partial<ProductTranslation>,
      ) {
        const id = `${productId}-${languageId}`
        if (!get().productTranslations[id]) {
          set((state) => ({
            productTranslations: { ...state.productTranslations, [id]: params as any },
          }))

          await fetcher.post<ProductTranslation[]>(`/products/${productId}/translations`, {
            languageId,
            ...get().productTranslations[id],
          })

          return
        }

        set((state) => ({
          productTranslations: {
            ...state.productTranslations,
            [`${productId}-${languageId}`]: {
              ...state.productTranslations[`${productId}-${languageId}`],
              ...params,
            },
          },
        }))
        await prepareProductTranslationsUpdate(productId, languageId, params)
      },
      async createProductTranslation() {},
    }),
    'product translation',
  ),
)

export default useProductTranslationStore
