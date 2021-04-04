export type RootStackParamList = {
  MainTabNavigator: undefined
  NotFound: undefined
}

export type MainTabParamList = {
  Scan: undefined
  SearchStackNavigator: {
    screen?: 'SearchProduct'
    params?: SearchStackParamList['SearchProduct']
  }
  History: undefined
  FrequentQuestions: undefined
}

export type SearchStackParamList = {
  Search: undefined
  SearchProduct: { productId: number }
}
