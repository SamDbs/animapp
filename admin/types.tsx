/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  NotFound: undefined
}

export type AuthStackParamList = {
  Login: undefined
}

export type MainTabParamList = {
  BrandStack: undefined
  Contacts: undefined
  FaqStack: undefined
  IngredientStack: undefined
  LanguageStack: undefined
  ProductStack: undefined
}

export type ProductStackParamList = {
  Products: undefined
  Product: { id: string }
}

export type LanguageStackParamList = {
  Languages: undefined
  Language: { id: string }
}

export type IngredientStackParamList = {
  Ingredients: undefined
  Ingredient: { id: string }
}

export type FaqStackParamList = {
  Faqs: undefined
  Faq: { id: string }
}

export type BrandStackParamList = {
  Brands: undefined
  Brand: { id: string }
}

export type TabOneParamList = {
  TabOneScreen: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
}
