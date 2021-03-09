import Language from '../models/language'
import Product from '../models/product'

export default function viewProduct(product: Product, language: Language['id'] | undefined = 'fr') {
  const productClient = {
    id: product.id,
    type: product.type,
    name: product.name,
    description:
      product.translations.find((desc) => desc.languageId === language)?.description ??
      'This product is not translated yet',
  }
  return productClient
}
