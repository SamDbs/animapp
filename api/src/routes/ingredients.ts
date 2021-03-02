import { Router } from 'express'

import Ingredient from '../models/ingredient'

const router = Router()

router.get('/', async (req, res) => {
  const ingredients = await Ingredient.find()
  res.json(ingredients)
})
router.post('/', (req, res) => res.json({ name: 'ok' }))
router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))
router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
