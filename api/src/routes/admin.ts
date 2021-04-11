import { Router } from 'express'

import * as adminController from '../controllers/adminController'
import { authAdmin } from '../middleware/admin'

const router = Router()
router.use(authAdmin)
router.post('/', adminController.createAdmin)

export default router
