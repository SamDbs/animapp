import { RequestHandler } from 'express'

import Faq from '../models/faq'
import FaqTranslation from '../models/faqTranslation'
import { viewFaq, viewFaqs, viewFaqTranslation, viewFaqWithTranslations } from '../views/faq'

export const getAllFaq: RequestHandler = async (req, res) => {
  try {
    const faqs = await Faq.find({ relations: ['translations'], order: { id: 'ASC' } })
    res.json(viewFaqs(faqs, req.params.lang))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getFaqById: RequestHandler = async (req, res) => {
  try {
    const faq = await Faq.findOne(req.params.id, { relations: ['translations'] })
    console.log(faq)
    if (!faq) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query
    res.json(viewFaq(faq, language as string))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createFaq: RequestHandler = async (req, res) => {
  try {
    const faq = Faq.create(req.body as Faq)
    await faq.save()
    res.status(201).json(faq)
  } catch {
    res.sendStatus(400)
  }
}

export const patchFaq: RequestHandler = async (req, res) => {
  try {
    await Faq.update(req.params.id, req.body)
    const faq = await Faq.findOneOrFail(req.params.id)
    res.status(200).json(faq)
  } catch {
    res.sendStatus(400)
  }
}

export const deleteFaq: RequestHandler = async (req, res) => {
  try {
    const faq = await Faq.findOneOrFail(req.params.id)
    if (!faq) {
      res.sendStatus(404)
      return
    }
    faq.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}

// CRUD Translations
export const getAllFaqTranslations: RequestHandler = async (req, res) => {
  try {
    const faqTranslations = await FaqTranslation.find({
      where: { faqId: parseInt(req.params.id) },
    })
    if (!faqTranslations) {
      res.sendStatus(404)
      return
    }

    res.json(viewFaqWithTranslations(faqTranslations))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createFaqTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = FaqTranslation.create({
      languageId: req.body.languageId.toUpperCase(),
      question: req.body.question,
      answer: req.body.answer,
    } as FaqTranslation)
    translation.faqId = parseInt(req.params.id)
    await translation.save()
    res.status(201).json(translation)
  } catch {
    res.sendStatus(400)
  }
}

export const patchFaqTranslation: RequestHandler = async (req, res) => {
  try {
    await FaqTranslation.update(
      { faqId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
      req.body,
    )
    const faqTranslation = await FaqTranslation.findOneOrFail({
      where: { faqId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
    })
    if (!faqTranslation) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(viewFaqTranslation(faqTranslation))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteFaqTranslation: RequestHandler = async (req, res) => {
  try {
    const faqTranslation = await FaqTranslation.findOneOrFail({
      faqId: parseInt(req.params.id),
      languageId: req.params.lang.toUpperCase(),
    })
    if (!faqTranslation) {
      res.sendStatus(404)
      return
    }
    faqTranslation.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
