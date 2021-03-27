import { Router } from 'express'

const router = Router()

router.get('/:code', (req, res) => res.json({ productId: 1 }))

export default router
