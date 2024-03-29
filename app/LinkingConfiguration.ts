import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      MainTabNavigator: {
        screens: {
          ScanProductStackNavigator: {
            screens: {
              Scan: 'scan',
              ScanProduct: 'scan-product',
            },
          },
          SearchStackNavigator: {
            screens: {
              Search: 'search',
              SearchProduct: 'search-product',
            },
          },
          HistoryStackNavigator: {
            screens: {
              History: 'history',
              HistoryProduct: 'history-product',
            },
          },
          About: {
            screens: {
              AboutHome: 'about',
              FrequentQuestions: 'help-faq',
              Contact: 'help-contact',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
}
