import { Router } from 'express'

import Ingredient from '../models/ingredient'
import { viewIngredients } from '../views/ingredient'

const router = Router()

router.get('/', async (req, res) => {
  const ingredients = await Ingredient.find({ relations: ['translations'] })
  res.json(viewIngredients(ingredients, 'TF'))
})

router.post('/', async (req, res) => {
  try {
    const ingredient = Ingredient.create(req.body as Ingredient)
    await ingredient.save()

    res.status(201).json(ingredient)
  } catch {
    res.sendStatus(400)
  }
})
router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))
router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
