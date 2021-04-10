import { Router } from 'express'

import * as adminController from '../controllers/adminController'

const router = Router()

router.post('/', adminController.createAdmin)

export default router
