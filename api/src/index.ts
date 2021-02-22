import express from 'express'

import scan from './routes/scan'
import products from './routes/products'

const PORT = 8080
const HOST = '0.0.0.0'
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/scan', scan)
app.use('/products', products)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
