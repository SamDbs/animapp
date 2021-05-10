import { Router } from 'express'

import * as brandController from '../controllers/brandController'
import { authAdmin } from '../middleware/admin'

const router = Router()

router.use(authAdmin)
router.get('/', brandController.getAllBrands)
router.get('/:id', brandController.getBrandById)
router.post('/', brandController.createBrand)
router.patch('/:id', brandController.patchBrand)
router.delete('/:id', brandController.deleteBrand)

export default router
