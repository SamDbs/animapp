import { Router } from 'express'

import * as ingredientController from '../controllers/ingredientController'

const router = Router()

router.get('/', ingredientController.getAllIngredients)
router.post('/', ingredientController.createIngredient)
router.get('/:id', ingredientController.getIngredientById)
router.patch('/:id', ingredientController.patchIngredient)
// router.delete('/:id', ingredientController.deleteIngredient)

// CRUD translations
router.get('/:id/translations', ingredientController.getIngredientByIdWithTranslations)
router.post('/:id', ingredientController.createIngredientTranslation)
// router.patch('/:id', ingredientController.patchIngredientTranslation)
// router.delete('/:id/translations/:lang', ingredientController.deleteIngredientTranslation)

export default router
