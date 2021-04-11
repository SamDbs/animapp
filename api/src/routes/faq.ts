import { Router } from 'express'

import * as faqController from '../controllers/faqController'
import { authAdmin } from '../middleware/admin'

const router = Router()

router.get('/', faqController.getAllFaq)

router.use(authAdmin)
router.get('/:id', faqController.getFaqById)
router.post('/', faqController.createFaq)
router.patch('/:id', faqController.patchFaq)
router.delete('/:id', faqController.deleteFaq)

// CRUD translations
router.get('/:id/translations', faqController.getAllFaqTranslations)
router.post('/:id/translations', faqController.createFaqTranslation)
router.patch('/:id/translations/:lang', faqController.patchFaqTranslation)
router.delete('/:id/translations/:lang', faqController.deleteFaqTranslation)

export default router
