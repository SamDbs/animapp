import { Router } from 'express'

import * as ingredientController from '../controllers/ingredientController'

const router = Router()

router.get('/', ingredientController.getAllIngredients)
router.post('/', ingredientController.createIngredient)
router.get('/:id', ingredientController.getIngredientById)
router.patch('/:id', ingredientController.patchIngredient)
router.delete('/:id', ingredientController.deleteIngredient)

// CRUD translations
router.get('/:id/translations', ingredientController.getAllIngredientTranslations)
router.post('/:id/translations', ingredientController.createIngredientTranslation)
router.patch('/:id/translations/:lang', ingredientController.patchIngredientTranslation)
router.delete('/:id/translations/:lang', ingredientController.deleteIngredientTranslation)

export default router
