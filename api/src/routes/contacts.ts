import { Router } from 'express'

import * as contactController from '../controllers/contactController'
import { authAdmin } from '../middleware/admin'

const router = Router()
router.post('/', contactController.createContact)

router.use(authAdmin)
router.get('/', contactController.getAllContacts)
router.get('/:id', contactController.getContactById)
router.delete('/:id', contactController.deleteContact)

export default router
