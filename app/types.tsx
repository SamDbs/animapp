export type RootStackParamList = {
  MainTabNavigator: undefined
  Product: { productId: number }
  Ingredient: { ingredientId: number }
  NotFound: undefined
}

export type MainTabParamList = {
  Scan: undefined
  Search: undefined
  History: undefined
  FrequentQuestions: undefined
}

export type SearchStackParamList = {
  Search: undefined
}
