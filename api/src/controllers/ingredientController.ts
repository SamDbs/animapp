import { FindManyOptions, FindOperator, In } from 'typeorm'
import { RequestHandler } from 'express'

import Image from '../models/image'
import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import {
  viewIngredient,
  viewIngredients,
  viewIngredientTranslation,
  viewIngredientTranslations,
} from '../views/ingredient'

export const getAllIngredients: RequestHandler = async (req, res) => {
  if (req.query.q) {
    const translations = await IngredientTranslation.find({
      where: [
        { name: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { description: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { review: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
      ],
    })
    const ingredientIds = translations.map((translation) => translation.ingredientId)
    const where: FindManyOptions<Ingredient>['where'] = { id: In(ingredientIds) }
    const ingredients = await Ingredient.find({
      relations: ['translations'],
      order: { id: 'ASC' },
      where,
    })
    res.json(viewIngredients(ingredients, req.params.lang?.toString()))
    return
  }
  const ingredients = await Ingredient.find({
    relations: ['translations'],
    order: { id: 'ASC' },
  })
  res.json(viewIngredients(ingredients, req.query.lang?.toString()))
}

export const createIngredient: RequestHandler = async (req, res) => {
  const ingredient = Ingredient.create(req.body as Ingredient)
  await ingredient.save()
  res.status(201).json(ingredient)
}

export const getIngredientById: RequestHandler = async (req, res) => {
  const ingredient = await Ingredient.findOneOrFail(req.params.id, { relations: ['translations'] })
  const { language } = req.query
  res.json(viewIngredient(ingredient, language?.toString().toUpperCase()))
}

export const patchIngredient: RequestHandler = async (req, res) => {
  await Ingredient.update(req.params.id, req.body)
  const ingredient = await Ingredient.findOneOrFail(req.params.id)
  res.status(200).json(ingredient)
}

export const setIngredientImage: RequestHandler = async (req, res) => {
  const ingredient = await Ingredient.findOneOrFail(req.params.id)
  const existingImage = await Image.findOne({ where: { ingredientId: ingredient.id } })

  const img = existingImage || Image.create({ ingredientId: ingredient.id })

  img.image = req.file.buffer
  img.url = `${process.env.HOST_URL}/ingredients/${ingredient.id}/image`
  img.type = req.file.mimetype

  await img.save()
  res.status(200).json(img)
}

export const getIngredientImage: RequestHandler = async (req, res) => {
  const ingredient = await Ingredient.findOneOrFail(req.params.id)
  const img = await Image.findOneOrFail({ where: { ingredientId: ingredient.id } })
  res.status(200).set('Content-Type', img.type).send(img.image)
}

export const deleteIngredient: RequestHandler = async (req, res) => {
  const ingredient = await Ingredient.findOneOrFail(req.params.id)
  ingredient.softRemove()
  res.sendStatus(200)
}

// CRUD Translations
export const getAllIngredientTranslations: RequestHandler = async (req, res) => {
  const ingredient = await Ingredient.findOneOrFail(req.params.id, { relations: ['translations'] })
  res.json(viewIngredientTranslations(ingredient.translations))
}

export const createIngredientTranslation: RequestHandler = async (req, res) => {
  const translation = IngredientTranslation.create({
    languageId: req.body.languageId.toUpperCase(),
    name: req.body.name,
    description: req.body.description,
    review: req.body.review,
  } as IngredientTranslation)
  translation.ingredientId = parseInt(req.params.id)
  await translation.save()
  res.status(201).json(translation)
}

export const patchIngredientTranslation: RequestHandler = async (req, res) => {
  await IngredientTranslation.update(
    { ingredientId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
    req.body,
  )
  const ingredientTranslation = await IngredientTranslation.findOneOrFail({
    where: { ingredientId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
  })
  res.status(200).json(viewIngredientTranslation(ingredientTranslation))
}

export const deleteIngredientTranslation: RequestHandler = async (req, res) => {
  const ingredientTranslation = await IngredientTranslation.findOneOrFail({
    ingredientId: parseInt(req.params.id),
    languageId: req.params.lang.toUpperCase(),
  })
  ingredientTranslation.softRemove()
  res.sendStatus(200)
}
