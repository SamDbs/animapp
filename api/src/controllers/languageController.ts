import { RequestHandler } from 'express'

import Language from '../models/language'
import { viewLanguage, viewLanguages } from '../views/language'

export const getAllLanguages: RequestHandler = async (req, res) => {
  const languages = await Language.find()
  res.json(viewLanguages(languages))
}

export const getLanguageById: RequestHandler = async (req, res) => {
  const language = await Language.findOneOrFail(req.params.id.toUpperCase())
  res.json(viewLanguage(language))
}

export const createLanguage: RequestHandler = async (req, res) => {
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
  res.status(201).json(viewLanguage(newLanguage))
}

export const patchLanguage: RequestHandler = async (req, res) => {
  await Language.update(req.params.id.toUpperCase(), req.body)
  const language = await Language.findOneOrFail(req.params.id.toUpperCase())
  res.status(200).json(viewLanguage(language))
}

export const deleteLanguage: RequestHandler = async (req, res) => {
  const language = await Language.findOneOrFail(req.params.id.toUpperCase())
  language.softRemove()
  res.sendStatus(200)
}
