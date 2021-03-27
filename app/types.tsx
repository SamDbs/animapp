export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  ScanProductStackNavigator: undefined
  SearchStackNavigator: undefined
  ProductsHistory: undefined
}

export type SearchStackParamList = {
  Search: undefined
  Product: { productId: number }
}

export type ScanProductStackParamList = {
  ScanProduct: undefined
  Product: { productId: number }
}
