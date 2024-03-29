import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import cors from 'cors'
import { config } from 'dotenv'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'type-graphql'
config()

import 'express-async-errors'
import products from './routes/products'
import ingredients from './routes/ingredients'
import authentication from './routes/authentication'
import admin from './routes/admin'
import { errorHandler } from './middleware/errorHandler'
import { authChecker, isConnected } from './middleware/admin'
import IngredientResolver from './resolvers/ingredient'
import ProductResolver from './resolvers/product'
import ProductIngredientResolver from './resolvers/productIngredient'
import ContactResolver from './resolvers/contact'
import LanguageResolver from './resolvers/language'
import FaqResolver from './resolvers/faq'
import BrandResolver from './resolvers/brand'
import TranslationResolver from './resolvers/translation'
import AnalyticalConstituentResolver from './resolvers/constituent'
import ProductConstituentResolver from './resolvers/productConstituent'
import SearchResolver from './resolvers/search'

const PORT = (process.env.PORT as unknown as number) || 8080
const HOST = '0.0.0.0'

async function main() {
  if (process.env.DATABASE_URL) {
    console.log("C'est la prod")
    try {
      await createConnection({
        url: process.env.DATABASE_URL,
        type: 'postgres',
        ssl: true,
        extra: { ssl: { rejectUnauthorized: false } },
        entities: ['./build/src/models/*.js'],
      })
      console.log('dbconnectedProd')
    } catch (error) {
      console.log('error prod', error)
    }
  } else {
    console.log("C'est local")
    try {
      await createConnection()
      console.log('dbconnectedlocal')
    } catch (error) {
      console.log('error local', error)
    }
  }

  const schema = await buildSchema({
    authChecker,
    authMode: 'error',
    resolvers: [
      AnalyticalConstituentResolver,
      BrandResolver,
      ContactResolver,
      FaqResolver,
      IngredientResolver,
      LanguageResolver,
      ProductConstituentResolver,
      ProductIngredientResolver,
      ProductResolver,
      SearchResolver,
      TranslationResolver,
    ],
  })

  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(isConnected)

  app.use((req, res, next) => {
    console.log('req:', req.method, req.path, req.query)
    // setTimeout(next, 5000)
    next()
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/products', products)
  app.use('/ingredients', ingredients)
  app.use('/auth', authentication)
  app.use('/admin', admin)

  type Res = { locals: { admin: object; restUrl: string } }

  app.use(
    '/graphql',
    graphqlHTTP((req, res) => ({
      schema,
      context: {
        admin: (res as unknown as Res).locals?.admin,
        restUrl: (res as unknown as Res).locals?.restUrl,
      },
    })),
  )

  app.use(errorHandler)
  app.use((req, res) => {
    res.status(404).json({ error: true, status: 404 })
  })

  app.listen(PORT, HOST)
  console.log(`Running on http://${HOST}:${PORT}`)
}

main()
