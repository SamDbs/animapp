import { FindManyOptions, FindOperator, In } from 'typeorm'
import { RequestHandler } from 'express'

import Faq from '../models/faq'
import { viewFaq, viewFaqs, viewFaqTranslation, viewFaqWithTranslations } from '../views/faq'

// const allowedFaqFilterKeys: (keyof FaqTranslation)[] = ['question', 'answer']
// function GetAllowedFaqFilters(key: string): key is keyof FaqTranslation {
//   return allowedFaqFilterKeys.includes(key as keyof FaqTranslation)
// }

// async function getFilters(
//   query: Request['query'],
// ): Promise<FindManyOptions<Faq>['where'] | undefined> {
//   const where: FindManyOptions<FaqTranslation>['where'] = {}

//   Object.entries(query).forEach(([key, value]) => {
//     if (key && GetAllowedFaqFilters(key)) {
//       if (key === 'question' || key === 'answer')
//         where[key] = new FindOperator('ilike', `%${value}%`)
//       else where[key] = value
//     }
//   })

//   if (!Object.keys(where).length) return
//   const translations = await FaqTranslation.find({ where })
//   const faqIds = translations.map((translation) => translation.faqId)
//   const whereFaq: FindManyOptions<Faq>['where'] = { id: In(faqIds) }
//   return whereFaq
// }

const limit = 5

export const getAllFaq: RequestHandler = async (req, res) => {
  const desiredPage = parseInt(req.query?.page?.toString() ?? '0')
  const page = desiredPage < 0 ? 0 : desiredPage
  const offset = limit * page

  if (req.query.q) {
    const translations = await FaqTranslation.find({
      where: [
        { question: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { answer: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
      ],
    })
    const faqIds = translations.map((translation) => translation.faqId)
    const where: FindManyOptions<Faq>['where'] = { id: In(faqIds) }
    const [faqs, count] = await Faq.findAndCount({
      relations: ['translations'],
      order: { id: 'ASC' },
      where,
      take: limit,
      skip: offset,
    })
    res.json({
      faqs: viewFaqs(faqs, req.params.lang?.toString()),
      pagination: { count, limit, offset, page },
    })
    return
  }
  const [faqs, count] = await Faq.findAndCount({
    relations: ['translations'],
    order: { id: 'ASC' },
    take: limit,
    skip: offset,
  })
  res.json({
    faqs: viewFaqs(faqs, req.params.lang?.toString()),
    pagination: { count, limit, offset, page },
  })
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
