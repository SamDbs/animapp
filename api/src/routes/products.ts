import { Router } from 'express'

import * as productController from '../controllers/productController'

const router = Router()

router.get('/', productController.getAllProducts)
router.post('/', productController.createProduct)
router.get('/:id', productController.getProductById)

router.patch('/:id', productController.patchProduct)
router.get('/:id/ingredients', productController.getIngredientsByProduct)

router.delete('/:id', productController.deleteProduct)

// CRUD translations
router.post('/:id/translations', productController.createProductTranslation)
router.get('/:id/translations', productController.getAllProductTranslations)
// router.patch('/:id/translations/:id', productController.patchProductTranslation)
// router.delete('/:id/translations/:id', productController.deleteProductTranslation)

export default router
