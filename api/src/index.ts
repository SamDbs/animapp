import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'
import cors from 'cors'
import { config } from 'dotenv'
config()

import 'express-async-errors'
import search from './routes/search'
import products from './routes/products'
import brands from './routes/brands'
import ingredients from './routes/ingredients'
import contacts from './routes/contacts'
import faq from './routes/faq'
import languages from './routes/languages'
import analyticalConstituents from './routes/analyticalConstituents'
import authentication from './routes/authentication'
import admin from './routes/admin'
import { errorHandler } from './middleware/errorHandler'

const PORT = ((process.env.PORT as unknown) as number) || 8080
const HOST = '0.0.0.0'
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

const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log('req:', req.path, req.query)
  // setTimeout(next, 5000)
  next()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/search', search)
app.use('/products', products)
app.use('/brands', brands)
app.use('/ingredients', ingredients)
app.use('/contacts', contacts)
app.use('/faq', faq)
app.use('/languages', languages)
app.use('/analyticalConstituents', analyticalConstituents)
app.use('/auth', authentication)
app.use('/admin', admin)

app.use(errorHandler)
app.use((req, res) => {
  res.status(404).json({ error: true, status: 404 })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

// async function sync() {
//   const connec = await connection
//   connec.synchronize(true)
// }
// sync()
