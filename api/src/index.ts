import express from 'express'
import { createConnection } from 'typeorm'

import scan from './routes/scan'
import products from './routes/products'
import ingredients from './routes/ingredients'
import contact from './routes/contact'
import faq from './routes/faq'
import languages from './routes/languages'

const PORT = 8080
const HOST = '0.0.0.0'
const connection = createConnection()
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/scan', scan)
app.use('/products', products)
app.use('/ingredients', ingredients)
app.use('/contact', contact)
app.use('/faq', faq)
app.use('/languages', languages)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)

async function sync() {
  const connec = await connection
  connec.synchronize(true)
}
sync()
