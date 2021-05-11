import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Auth: { screens: { Login: 'login' } },
      Main: {
        screens: {
          ProductStack: {
            screens: {
              Products: 'products',
              Product: 'products/:id',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
}
