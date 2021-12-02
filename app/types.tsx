export type RootStackParamList = {
  MainTabNavigator: undefined
  Product: { productId: string }
  Faq: { faqId: string }
  NotFound: undefined
}

export type MainTabParamList = {
  Analysis: undefined
  History: undefined
  Scan: undefined
  Search: undefined
  About: undefined
}

export type SearchStackParamList = {
  Search: undefined
}

export type HelpStackParamList = {
  AboutHome: undefined
  FrequentQuestions: undefined
  Contact: undefined
}
