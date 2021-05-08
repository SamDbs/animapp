import { Router } from 'express'
import Multer, { memoryStorage } from 'multer'

import * as ingredientController from '../controllers/ingredientController'
import { authAdmin } from '../middleware/admin'

const upload = Multer({ storage: memoryStorage() })

const router = Router()

router.get('/:id', ingredientController.getIngredientById)
router.get('/:id/image', ingredientController.getIngredientImage)

router.use(authAdmin)

router.get('/', ingredientController.getAllIngredients)
router.post('/', ingredientController.createIngredient)
router.patch('/:id', ingredientController.patchIngredient)
router.delete('/:id', ingredientController.deleteIngredient)
router.put('/:id/image', upload.single('image'), ingredientController.setIngredientImage)

// CRUD translations
router.get('/:id/translations', ingredientController.getAllIngredientTranslations)
router.post('/:id/translations', ingredientController.createIngredientTranslation)
router.patch('/:id/translations/:lang', ingredientController.patchIngredientTranslation)
router.delete('/:id/translations/:lang', ingredientController.deleteIngredientTranslation)

export default router
