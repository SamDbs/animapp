import { Router } from 'express'

import * as languageController from '../controllers/languageController'
import { authAdmin } from '../middleware/admin'

const router = Router()

router.use(authAdmin)
router.get('/', languageController.getAllLanguages)
router.get('/:id', languageController.getLanguageById)
router.post('/', languageController.createLanguage)
router.patch('/:id', languageController.patchLanguage)
router.delete('/:id', languageController.deleteLanguage)

export default router
