import { Router } from 'express'
import Multer, { memoryStorage } from 'multer'

import * as productController from '../controllers/productController'
import { authAdmin } from '../middleware/admin'

const upload = Multer({ storage: memoryStorage() })

const router = Router()

router.get('/:id', productController.getProductById)
router.get('/:id/image', productController.getProductImage)
router.get('/:id/ingredients', productController.getIngredientsByProduct)
router.get('/:id/analytical-constituents', productController.getACByProduct)

router.use(authAdmin)
router.get('/', productController.getAllProducts)
router.post('/', productController.createProduct)
router.patch('/:id', productController.patchProduct)
router.delete('/:id', productController.deleteProduct)
router.put('/:id/image', upload.single('image'), productController.setProductImage)

router.get('/:id/brand', productController.getBrandByProductIdx)
router.put('/:id/brand', productController.updateBrandInProductIdx)

// CRUD ingredients
router.put('/:id/ingredients/:ingredientId', productController.upsertProductIngredient)
router.delete('/:id/ingredients/:ingredientId', productController.deleteProductIngredient)

// CRUD AC
router.put('/:id/analytical-constituents/:idAC', productController.createProductACQuantity)
router.delete('/:id/analytical-constituents/:idAC', productController.deleteProductACQuantity)

// CRUD translations
router.post('/:id/translations', productController.createProductTranslation)
router.get('/:id/translations', productController.getAllProductTranslations)
router.patch('/:id/translations/:lang', productController.patchProductTranslation)
router.delete('/:id/translations/:lang', productController.deleteProductTranslation)

export default router
