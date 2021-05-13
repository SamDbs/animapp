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
  ProductStack: undefined
}

export type ProductStackParamList = {
  Products: undefined
  Product: { id: string }
}

export type TabOneParamList = {
  TabOneScreen: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
}