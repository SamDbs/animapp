import { Router } from 'express'

import Product from '../models/product'

const router = Router()

router.get('/', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

router.post('/', async (req, res) => {
  try {
    const product = Product.create(req.body as Product)
    await product.save()

    res.status(201).json(product)
  } catch {
    res.sendStatus(400)
  }
})

router.get('/:id', async (req, res) => {
  const product = await Product.findOne(req.params.id)
  if (!product) {
    res.sendStatus(404)
    return
  }
  res.json(product)
})

router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))
router.get('/:id/ingredients', (req, res) =>
  res.json({ name: 'test', id: req.params.id, ingredients: [1, 2, 3] }),
)

router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
