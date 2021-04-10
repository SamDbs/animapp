import { Router } from 'express'

import * as authenticationController from '../controllers/authenticationController'

const router = Router()

router.post('/', authenticationController.authenticate)

export default router
