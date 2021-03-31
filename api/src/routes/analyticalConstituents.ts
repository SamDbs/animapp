import { Router } from 'express'

import * as analyticalConstituentController from '../controllers/analyticalConstituentController'

const router = Router()

router.get('/', analyticalConstituentController.getAllAnalyticalConstituents)
// router.post('/', analyticalConstituentController.createAnalyticalConstituent)
// router.get('/:id', analyticalConstituentController.getAnalyticalConstituentById)
// router.patch('/:id', analyticalConstituentController.patchAnalyticalConstituent)
// router.delete('/:id', analyticalConstituentController.deleteAnalyticalConstituent)

// // CRUD translations
// router.get(
//   '/:id/translations',
//   analyticalConstituentController.getAnalyticalConstituentByIdWithTranslations,
// )
// router.post(
//   '/:id/translations',
//   analyticalConstituentController.createAnalyticalConstituentTranslation,
// )
// router.patch(
//   '/:id/translations/:lang',
//   analyticalConstituentController.patchAnalyticalConstituentTranslation,
// )
// router.delete(
//   '/:id/translations/:lang',
//   analyticalConstituentController.deleteAnalyticalConstituentTranslation,
// )

export default router
