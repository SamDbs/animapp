import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      MainTabNavigator: {
        screens: {
          ScanProductStackNavigator: {
            screens: {
              ScanProduct: 'scan',
              Product: 'product',
            },
          },
          SearchStackNavigator: {
            screens: {
              Search: 'search',
              Product: 'scan',
            },
          },
          ProductsHistory: 'history',
          FrequentQuestions: 'faq',
        },
      },
      NotFound: '*',
    },
  },
}
