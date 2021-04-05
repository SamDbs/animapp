import Faq from '../models/faq'
import Language from '../models/language'
import FaqTranslation from '../models/faqTranslation'

export function viewFaqs(faqs: Faq[], language: Language['id'] = 'FR') {
  return faqs.map((faq) => viewFaq(faq, language))
}

export function viewFaq(faq: Faq, language: Language['id'] = 'FR') {
  let faqTranslation = faq.translations.find((t) => t.languageId === language)

  if (!faqTranslation) faqTranslation = faq.translations.find((t) => t.languageId === 'FR')

  const faqClient = {
    id: faq.id,
    question: faqTranslation?.question ?? 'This question is not translated yet',
    answer: faqTranslation?.answer ?? 'This answer is not translated yet',
  }
  return faqClient
}

export function viewFaqWithTranslations(faqTranslations: FaqTranslation[]) {
  return faqTranslations
}

export function viewFaqTranslation(faqTranslation: FaqTranslation) {
  return faqTranslation
}
