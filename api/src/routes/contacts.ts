import { Router } from 'express'

import * as contactController from '../controllers/contactController'

const router = Router()

router.get('/', contactController.getAllContacts)

router.post('/', (req, res) => res.json({ name: 'ok' }))
router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))
router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
