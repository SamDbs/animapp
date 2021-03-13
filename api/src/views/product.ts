import Language from '../models/language'
import Product from '../models/product'

export default function viewProduct(product: Product, language: Language['id'] | undefined = 'FR') {
  const productClient = {
    id: product.id,
    type: product.type,
    name: product.name,
    description:
      product.translations.find((t) => t.languageId === language)?.description ??
      'This product is not translated yet',
  }
  return productClient
}

export function viewProducts(ingredients: Product[], language: Language['id'] = 'FR') {
  return ingredients.map((ingredient) => viewProduct(ingredient, language))
}
