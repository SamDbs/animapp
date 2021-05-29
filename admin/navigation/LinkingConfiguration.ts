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
          LanguageStack: {
            screens: {
              Languages: 'languages',
              Language: 'languages/:id',
            },
          },
          FaqStack: {
            screens: {
              Faqs: 'faq',
              Faq: 'faq/:id',
            },
          },
          Contacts: 'contacts',
          ProductStack: {
            screens: {
              Products: 'products',
              Product: 'products/:id',
            },
          },
          BrandStack: {
            screens: {
              Brands: 'brands',
              Brand: 'brands/:id',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
}
