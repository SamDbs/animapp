import Language from '../models/language'
import Product from '../models/product'
import { TranslationEntityType } from '../models/translation'
import TranslationService from '../services/TranslationService'

export async function viewProduct(product: Product, languageId: Language['id'] | undefined = 'EN') {
  const descriptionPromise = new TranslationService().get(
    `${product.id}-description`,
    languageId,
    TranslationEntityType.PRODUCT,
    'This product is not translated yet',
  )

  const productClient = {
    id: product.id,
    name: product.name,
    type: product.type,
    barCode: product.barCode,
    image: product?.image?.url ?? 'https://via.placeholder.com/400',
    brand: product.brand?.name,
    brandId: product.brand?.id,
    published: product.published,
    description: await descriptionPromise,
  }
  return productClient
}

export function viewProducts(ingredients: Product[], languageId: Language['id'] = 'EN') {
  return ingredients.map((ingredient) => viewProduct(ingredient, languageId))
}
