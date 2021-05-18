import * as Linking from 'expo-linking'

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Auth: { screens: { Login: 'login' } },
      Main: {
        screens: {
          IngredientStack: {
            screens: {
              Ingredients: 'ingredients',
              Ingredient: 'ingredients/:id',
            },
          },
          Contacts: 'contacts',
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
