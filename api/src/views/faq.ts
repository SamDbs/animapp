import { TranslationEntityType } from '../models/translation'
import Faq from '../models/faq'
import FaqTranslation from '../models/faqTranslation'
import Language from '../models/language'
import TranslationService from '../services/TranslationService'

export function viewFaqs(faqs: Faq[], language: Language['id'] = 'EN') {
  return faqs.map((faq) => viewFaq(faq, language))
}

export async function viewFaq(faq: Faq, languageId: Language['id'] = 'EN') {
  const t = new TranslationService()
  const questionPromise = t.get(
    `${faq.id}-question`,
    languageId,
    TranslationEntityType.FAQ,
    'This question is not translated yet',
  )
  const answerPromise = t.get(
    `${faq.id}-answer`,
    languageId,
    TranslationEntityType.FAQ,
    'This answer is not translated yet',
  )

  const faqClient = {
    id: faq.id,
    question: await questionPromise,
    answer: await answerPromise,
  }

  return faqClient
}

export function viewFaqWithTranslations(faqTranslations: FaqTranslation[]) {
  return faqTranslations
}

export function viewFaqTranslation(faqTranslation: FaqTranslation) {
  return faqTranslation
}
