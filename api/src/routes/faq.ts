import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => res.json({ name: 'ok' }))
router.post('/', (req, res) => res.json({ name: 'ok' }))

router.get('/:id', (req, res) => res.json({ name: 'ok', id: req.params.id }))
router.patch('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))
router.delete('/:id', (req, res) => res.json({ name: 'test', id: req.params.id }))

export default router
