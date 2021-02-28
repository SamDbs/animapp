import { Router } from 'express'

import Product from '../models/product'

const router = Router()

router.get('/', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})
router.post('/', (req, res) => res.json({ name: 'ok' }))

router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))

router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))
router.get('/:id/ingredients', (req, res) =>
  res.json({ name: 'test', id: req.params.id, ingredients: [1, 2, 3] }),
)

router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
