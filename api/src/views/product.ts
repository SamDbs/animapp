import Language from '../models/language'
import Product from '../models/product'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
import ProductTranslation from '../models/productTranslation'

export function viewAnalyticalConstituent(
  productAC: ProductAnalyticalConstituent,
  language: Language['id'] | undefined = 'FR',
) {
  let translation = productAC.analyticalConstituent.translations.find(
    (t) => t.languageId === language,
  )

  if (!translation)
    translation = productAC.analyticalConstituent.translations.find((t) => t.languageId === 'FR')

  const analyticalConstituentClient = {
    id: productAC.analyticalConstituentId,
    quantity: productAC.quantity,
    name: translation?.name ?? 'This product is not translated yet',
    description: translation?.description ?? 'This product is not translated yet',
  }
  return analyticalConstituentClient
}

export function viewAnalyticalConstituents(
  analyticalConstituents: ProductAnalyticalConstituent[],
  language: Language['id'] = 'FR',
) {
  return analyticalConstituents.map((analyticalConstituent) =>
    viewAnalyticalConstituent(analyticalConstituent, language),
  )
}

export function viewProduct(product: Product, language: Language['id'] | undefined = 'FR') {
  let translation = product.translations.find((t) => t.languageId === language)

  if (!translation) translation = product.translations.find((t) => t.languageId === 'FR')

  const productClient = {
    id: product.id,
    brand: product.brand?.name,
    type: product.type,
    name: product.name,
    image: product?.image?.url,
    description: translation?.description ?? 'This product is not translated yet',
  }
  return productClient
}

export function viewProducts(ingredients: Product[], language: Language['id'] = 'FR') {
  return ingredients.map((ingredient) => viewProduct(ingredient, language))
}

export function viewProductTranslations(productTranslations: ProductTranslation[]) {
  return productTranslations
}

export function viewProductTranslation(productTranslation: ProductTranslation) {
  return productTranslation
}
