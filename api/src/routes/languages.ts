import { Router } from 'express'

import Language from '../models/language'

const router = Router()

router.get('/', async (req, res) => {
  const languages = await Language.find()
  res.json(languages)
})

router.post('/', async (req, res) => {
  try {
    const language = Language.create(req.body as Language)
    await language.save()

    res.status(201).json(language)
  } catch {
    res.sendStatus(400)
  }
})

router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))

router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))
router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
