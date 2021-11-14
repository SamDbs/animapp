import { Router } from 'express'
import Multer, { memoryStorage } from 'multer'

import * as ingredientController from '../controllers/ingredientController'
import { authAdmin } from '../middleware/admin'

const upload = Multer({ storage: memoryStorage() })

const router = Router()

router.get('/:id/image', ingredientController.getIngredientImage)
router.use(authAdmin)
router.put('/:id/image', upload.single('image'), ingredientController.setIngredientImage)

export default router
