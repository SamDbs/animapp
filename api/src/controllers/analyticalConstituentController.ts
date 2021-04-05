import { RequestHandler } from 'express'

import AnalyticalConstituent from '../models/analyticalConstituent'
import ConstituentTranslation from '../models/constituentTranslation'
import {
  viewAnalyticalConstituentClient,
  viewAnalyticalConstituentsClient,
  viewAnalyticalConstituentWithTranslations,
  viewAnalyticalTranslation,
} from '../views/analyticalConstituent'

// Return all analytical constituent that exist in database according to the language sent in params
export const getAllAnalyticalConstituents: RequestHandler = async (req, res) => {
  const analyticalConstituents = await AnalyticalConstituent.find({
    relations: ['translations'],
    order: { id: 'ASC' },
  })
  const { language } = req.query

  res.json(
    viewAnalyticalConstituentsClient(analyticalConstituents, language?.toString().toUpperCase()),
  )
}

export const createAnalyticalConstituent: RequestHandler = async (req, res) => {
  const analyticalConstituent = AnalyticalConstituent.create(req.body as AnalyticalConstituent)
  await analyticalConstituent.save()
  res.status(201).json(analyticalConstituent)
}

export const getAnalyticalConstituentById: RequestHandler = async (req, res) => {
  const analyticalConstituent = await AnalyticalConstituent.findOneOrFail(req.params.id, {
    relations: ['translations'],
  })
  const { language } = req.query
  res.json(
    viewAnalyticalConstituentClient(analyticalConstituent, language?.toString().toUpperCase()),
  )
}

export const deleteAnalyticalConstituent: RequestHandler = async (req, res) => {
  const analyticalConstituent = await AnalyticalConstituent.findOneOrFail(req.params.id)
  analyticalConstituent.softRemove()
  res.sendStatus(200)
}

// CRUD Translations
export const getAllAnalyticalConstituentTranslations: RequestHandler = async (req, res) => {
  const constituentTranslation = await ConstituentTranslation.find({
    where: { analyticalConstituentId: parseInt(req.params.id) },
  })
  res.json(viewAnalyticalConstituentWithTranslations(constituentTranslation))
}

export const createAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  const translation = ConstituentTranslation.create({
    languageId: req.body.languageId.toUpperCase(),
    name: req.body.name,
    description: req.body.description,
  } as ConstituentTranslation)
  translation.analyticalConstituentId = parseInt(req.params.id)
  await translation.save()
  res.status(201).json(translation)
}

export const patchAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  await ConstituentTranslation.update(
    {
      analyticalConstituentId: parseInt(req.params.id),
      languageId: req.params.lang.toUpperCase(),
    },
    req.body,
  )
  const translation = await ConstituentTranslation.findOneOrFail({
    where: {
      analyticalConstituentId: parseInt(req.params.id),
      languageId: req.params.lang.toUpperCase(),
    },
  })
  res.status(200).json(viewAnalyticalTranslation(translation))
}

export const deleteAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  const translation = await ConstituentTranslation.findOneOrFail({
    analyticalConstituentId: parseInt(req.params.id),
    languageId: req.params.lang.toUpperCase(),
  })
  translation.softRemove()
  res.sendStatus(200)
}
