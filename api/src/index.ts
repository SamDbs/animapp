import express from 'express'
import { createConnection } from 'typeorm'
import { config } from 'dotenv'
config()

import 'express-async-errors'
import search from './routes/search'
import products from './routes/products'
import ingredients from './routes/ingredients'
import contacts from './routes/contacts'
import faq from './routes/faq'
import languages from './routes/languages'
import analyticalConstituents from './routes/analyticalConstituents'
import authentication from './routes/authentication'
import admin from './routes/admin'
import { errorHandler } from './controllers/errorHandler'

const PORT = 8080
const HOST = '0.0.0.0'
createConnection()
const app = express()

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
