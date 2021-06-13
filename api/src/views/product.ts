import Language from '../models/language'
import Product from '../models/product'
import ProductTranslation from '../models/productTranslation'

export function viewProduct(product: Product, language: Language['id'] | undefined = 'EN') {
  let translation = product.translations.find((t) => t.languageId === language)

  if (!translation) translation = product.translations.find((t) => t.languageId === 'EN')

  const productClient = {
    id: product.id,
    name: product.name,
    type: product.type,
    barCode: product.barCode,
    image: product?.image?.url ?? 'https://via.placeholder.com/400',
    brand: product.brand?.name,
    brandId: product.brand?.id,
    description: translation?.description ?? 'This product is not translated yet',
  }
  return productClient
}

export function viewProducts(ingredients: Product[], language: Language['id'] = 'EN') {
  return ingredients.map((ingredient) => viewProduct(ingredient, language))
}

export function viewProductTranslations(productTranslations: ProductTranslation[]) {
  return productTranslations
}

export function viewProductTranslation(productTranslation: ProductTranslation) {
  return productTranslation
}
