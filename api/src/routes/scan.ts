import { Router } from 'express'

const router = Router()

router.post('/', (req, res) => res.json({ name: 'ok' }))

export default router
