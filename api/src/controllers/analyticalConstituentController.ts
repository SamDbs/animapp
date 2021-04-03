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
  try {
    const analyticalConstituents = await AnalyticalConstituent.find({
      relations: ['translations'],
      order: { id: 'ASC' },
    })
    const { language } = req.query

    res.json(
      viewAnalyticalConstituentsClient(analyticalConstituents, language?.toString().toUpperCase()),
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createAnalyticalConstituent: RequestHandler = async (req, res) => {
  try {
    const analyticalConstituent = AnalyticalConstituent.create(req.body as AnalyticalConstituent)
    await analyticalConstituent.save()
    res.status(201).json(analyticalConstituent)
  } catch {
    res.sendStatus(400)
  }
}

export const getAnalyticalConstituentById: RequestHandler = async (req, res) => {
  try {
    const analyticalConstituent = await AnalyticalConstituent.findOne(req.params.id, {
      relations: ['translations'],
    })
    if (!analyticalConstituent) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query
    res.json(
      viewAnalyticalConstituentClient(analyticalConstituent, language?.toString().toUpperCase()),
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteAnalyticalConstituent: RequestHandler = async (req, res) => {
  try {
    const analyticalConstituent = await AnalyticalConstituent.findOneOrFail(req.params.id)
    if (!analyticalConstituent) {
      res.sendStatus(404)
      return
    }
    analyticalConstituent.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}

// CRUD Translations
export const getAllAnalyticalConstituentTranslations: RequestHandler = async (req, res) => {
  try {
    const constituentTranslation = await ConstituentTranslation.find({
      where: { analyticalConstituentId: parseInt(req.params.id) },
    })
    if (!constituentTranslation) {
      res.sendStatus(404)
      return
    }

    res.json(viewAnalyticalConstituentWithTranslations(constituentTranslation))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = ConstituentTranslation.create({
      languageId: req.body.languageId.toUpperCase(),
      name: req.body.name,
      description: req.body.description,
    } as ConstituentTranslation)
    translation.analyticalConstituentId = parseInt(req.params.id)
    await translation.save()
    res.status(201).json(translation)
  } catch {
    res.sendStatus(400)
  }
}

export const patchAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  try {
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
    if (!translation) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(viewAnalyticalTranslation(translation))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteAnalyticalConstituentTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = await ConstituentTranslation.findOneOrFail({
      analyticalConstituentId: parseInt(req.params.id),
      languageId: req.params.lang.toUpperCase(),
    })
    if (!translation) {
      res.sendStatus(404)
      return
    }
    translation.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
