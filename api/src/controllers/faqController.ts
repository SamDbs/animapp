import { RequestHandler } from 'express'

import Faq from '../models/faq'
import FaqTranslation from '../models/faqTranslation'
import { viewFaq, viewFaqs, viewFaqTranslation, viewFaqWithTranslations } from '../views/faq'

export const getAllFaq: RequestHandler = async (req, res) => {
  const faqs = await Faq.find({ relations: ['translations'], order: { id: 'ASC' } })
  res.json(viewFaqs(faqs, req.params.lang))
}

export const getFaqById: RequestHandler = async (req, res) => {
  const faq = await Faq.findOneOrFail(req.params.id, { relations: ['translations'] })
  const { language } = req.query
  res.json(viewFaq(faq, language as string))
}

export const createFaq: RequestHandler = async (req, res) => {
  const faq = Faq.create(req.body as Faq)
  await faq.save()
  res.status(201).json(faq)
}

export const patchFaq: RequestHandler = async (req, res) => {
  await Faq.update(req.params.id, req.body)
  const faq = await Faq.findOneOrFail(req.params.id)
  res.status(200).json(faq)
}

export const deleteFaq: RequestHandler = async (req, res) => {
  const faq = await Faq.findOneOrFail(req.params.id)
  faq.softRemove()
  res.sendStatus(200)
}

// CRUD Translations
export const getAllFaqTranslations: RequestHandler = async (req, res) => {
  const faq = await Faq.findOneOrFail(req.params.id, { relations: ['translations'] })
  res.json(viewFaqWithTranslations(faq.translations))
}

export const createFaqTranslation: RequestHandler = async (req, res) => {
  const translation = FaqTranslation.create({
    languageId: req.body.languageId.toUpperCase(),
    question: req.body.question,
    answer: req.body.answer,
  } as FaqTranslation)
  translation.faqId = parseInt(req.params.id)
  await translation.save()
  res.status(201).json(translation)
}

export const patchFaqTranslation: RequestHandler = async (req, res) => {
  await FaqTranslation.update(
    { faqId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
    req.body,
  )
  const faqTranslation = await FaqTranslation.findOneOrFail({
    where: { faqId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
  })
  res.status(200).json(viewFaqTranslation(faqTranslation))
}

export const deleteFaqTranslation: RequestHandler = async (req, res) => {
  const faqTranslation = await FaqTranslation.findOneOrFail({
    faqId: parseInt(req.params.id),
    languageId: req.params.lang.toUpperCase(),
  })
  faqTranslation.softRemove()
  res.sendStatus(200)
}
