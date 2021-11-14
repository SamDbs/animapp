import { Router } from 'express'

import * as analyticalConstituentController from '../controllers/analyticalConstituentController'
import { authAdmin } from '../middleware/admin'

const router = Router()

router.use(authAdmin)
router.get('/', analyticalConstituentController.getAllAnalyticalConstituents)
router.post('/', analyticalConstituentController.createAnalyticalConstituent)
router.get('/:id', analyticalConstituentController.getAnalyticalConstituentById)
router.delete('/:id', analyticalConstituentController.deleteAnalyticalConstituent)

// CRUD translations
router.get('/:id/translations', analyticalConstituentController.getAllAnalyticalConstituentTranslations)
router.post('/:id/translations', analyticalConstituentController.createAnalyticalConstituentTranslation)
router.patch('/:id/translations/:lang', analyticalConstituentController.patchAnalyticalConstituentTranslation)
router.delete('/:id/translations/:lang', analyticalConstituentController.deleteAnalyticalConstituentTranslation)

export default router
