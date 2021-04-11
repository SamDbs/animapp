import { Router } from 'express'

import * as searchController from '../controllers/searchController'

const router = Router()

router.get('/', searchController.searchAll)
router.get('/ingredients', searchController.searchByIngredients)

export default router
