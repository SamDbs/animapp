import { Router } from 'express'

import * as productController from '../controllers/productController'

const router = Router()

router.get('/', productController.getAllProducts)
router.post('/', productController.createProduct)
router.get('/:id', productController.getProductById)

router.patch('/:id', productController.patchProduct)
router.get('/:id/ingredients', productController.getIngredientsByProduct)
router.delete('/:id', productController.deleteProduct)

// CRUD AC
router.post('/:id/analyticalconstituents/:idAC', productController.createProductACQuantity)
router.get('/:id/analyticalconstituents', productController.getACByProduct)
router.patch('/:id/analyticalconstituents/:idAC', productController.patchACByProduct)
router.delete('/:id/analyticalconstituents/:idAC', productController.deleteProductACQuantity)

// CRUD translations
router.post('/:id/translations', productController.createProductTranslation)
router.get('/:id/translations', productController.getAllProductTranslations)
router.patch('/:id/translations/:lang', productController.patchProductTranslation)
router.delete('/:id/translations/:lang', productController.deleteProductTranslation)

export default router
