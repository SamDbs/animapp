import { Router } from 'express'

import * as languageController from '../controllers/languageController'

const router = Router()

router.get('/', languageController.getAllLanguages)
router.get('/:id', languageController.getLanguageById)
router.post('/', languageController.createLanguage)
router.patch('/:id', languageController.patchLanguage)
router.delete('/:id', languageController.deleteLanguage)

export default router
