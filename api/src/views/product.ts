import Language from '../models/language'
import Product from '../models/product'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
import ProductTranslation from '../models/productTranslation'

export function viewAnalyticalConstituent(
  analyticalConstituent: ProductAnalyticalConstituent,
  language: Language['id'] | undefined = 'FR',
) {
  console.log(analyticalConstituent, language)
  const analyticalConstituentClient = {
    id: analyticalConstituent.analyticalConstituentId,
    quantity: analyticalConstituent.quantity,
    name:
      analyticalConstituent.analyticalConstituent.translations.find(
        (t) => t.languageId === language,
      )?.name ?? 'This product is not translated yet',
    description:
      analyticalConstituent.analyticalConstituent.translations.find(
        (t) => t.languageId === language,
      )?.description ?? 'This product is not translated yet',
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
  const productClient = {
    id: product.id,
    type: product.type,
    name: product.name,
    photo: product.photo,
    description:
      product.translations.find((t) => t.languageId === language)?.description ??
      'This product is not translated yet',
    analyticalConstituents: viewAnalyticalConstituents(product.analyticalConstituents, language),
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
