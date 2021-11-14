import { Router } from 'express'
import Multer, { memoryStorage } from 'multer'

import * as productController from '../controllers/productController'
import { authAdmin } from '../middleware/admin'

const upload = Multer({ storage: memoryStorage() })

const router = Router()

router.get('/:id/image', productController.getProductImage)
router.use(authAdmin)
router.put('/:id/image', upload.single('image'), productController.setProductImage)

export default router
