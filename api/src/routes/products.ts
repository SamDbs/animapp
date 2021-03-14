import { Router } from 'express'

import * as productController from '../controllers/productController'

const router = Router()

router.get('/', productController.getAllProducts)
router.post('/', productController.createProduct)
router.get('/:id', productController.getProductById)

router.patch('/:id', productController.patchProduct)
router.get('/:id/ingredients', productController.getIngredientsByProduct)

router.delete('/:id', productController.deleteProduct)

export default router
