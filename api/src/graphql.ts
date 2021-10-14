import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { config } from 'dotenv'
import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

config()

import ProductResolver from './resolvers/product'
import IngredientResolver from './resolvers/ingredient'
import ProductIngredientResolver from './resolvers/productIngredient'

const PORT = (process.env.PORT as unknown as number) || 8080

async function main() {
  if (process.env.DATABASE_URL) {
    console.log('Cest la prod')
    createConnection({
      url: process.env.DATABASE_URL,
      type: 'postgres',
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
      entities: ['./build/src/models/*.js'],
    })
      .then(() => console.log('dbconnectedProd'))
      .catch((error) => console.log('error prod', error))
  } else {
    console.log('Cest local')
    createConnection()
      .then(() => console.log('dbconnectedlocal'))
      .catch((error) => console.log('error local', error))
  }

  const schema = await buildSchema({
    resolvers: [IngredientResolver, ProductResolver, ProductIngredientResolver],
  })
  const server = new ApolloServer({ schema })
  await server.listen(PORT)
  console.log('Server has started!')
}

main()
