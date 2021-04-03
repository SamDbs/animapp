import { RequestHandler } from 'express'

import Language from '../models/language'
import { viewLanguage } from '../views/language'

export const getAllLanguages: RequestHandler = async (req, res) => {
  try {
    const languages = await Language.find()
    res.json(languages)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getLanguageById: RequestHandler = async (req, res) => {
  try {
    const language = await Language.findOneOrFail(req.params.id.toUpperCase())
    if (!language) {
      res.sendStatus(404)
      return
    }
    res.json(viewLanguage(language))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createLanguage: RequestHandler = async (req, res) => {
  try {
    const language = await Language.findByIds(req.body.id.toUpperCase())
    if (language.length > 0) {
      res.status(409).send('This language already exists')
      return
    }
    const newLanguage = Language.create({
      id: req.body.id.toUpperCase(),
      name: req.body.name,
    } as Language)
    await newLanguage.save()
    res.status(201).json(newLanguage)
  } catch {
    res.sendStatus(400)
  }
}

export const patchLanguage: RequestHandler = async (req, res) => {
  try {
    await Language.update(req.params.id.toUpperCase(), req.body)
    const language = await Language.findOneOrFail(req.params.id.toUpperCase())
    res.status(200).json(language)
  } catch {
    res.sendStatus(400)
  }
}

export const deleteLanguage: RequestHandler = async (req, res) => {
  try {
    const language = await Language.findOneOrFail(req.params.id.toUpperCase())
    if (!language) {
      res.sendStatus(404)
      return
    }
    language.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
