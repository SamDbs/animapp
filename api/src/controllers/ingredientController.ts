import { FindManyOptions, FindOperator, In, IsNull, Not } from 'typeorm'
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
import { MissingParamError } from '../middleware/errorHandler'

const limit = 5

export const getAllIngredients: RequestHandler = async (req, res) => {
  const desiredPage = parseInt(req.query?.page?.toString() ?? '0')
  const page = desiredPage < 0 ? 0 : desiredPage
  const offset = limit * page
  const deletedIngredients = req.query.deleted ?? false

  if (req.query.q) {
    const translations = await IngredientTranslation.find({
      where: [
        { name: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { description: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { review: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
        { name: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'FR' },
        { description: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'FR' },
        { review: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'FR' },
      ],
      order: { name: 'ASC' },
    })
    const ingredientIds = translations.map((translation) => translation.ingredientId)
    const where: FindManyOptions<Ingredient>['where'] = {
      id: In(ingredientIds),
      deletedAt: deletedIngredients ? Not(IsNull()) : IsNull(),
    }
    const [ingredients, count] = await Ingredient.findAndCount({
      relations: ['translations'],
      order: { id: 'ASC' },
      where,
      take: limit,
      skip: offset,
      withDeleted: true,
    })
    res.json({
      pagination: { count, limit, offset, page },
      ingredients: viewIngredients(ingredients, req.params.lang?.toString()),
    })
    return
  }
  const [ingredients, count] = await Ingredient.createQueryBuilder('ingredient')
    .withDeleted()
    .where(deletedIngredients ? 'ingredient."deletedAt" IS NOT NULL' : 'ingredient."deletedAt" IS NULL')
    .leftJoinAndSelect('ingredient.translations', 'it', "it.languageId = 'EN'")
    .orderBy('it.name', 'ASC')
    .offset(offset)
    .limit(limit)
    .getManyAndCount()

  res.json({
    pagination: { count, limit, offset, page },
    ingredients: viewIngredients(ingredients, req.query.lang?.toString()),
  })
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
  if (typeof req.body.rating !== 'undefined') {
    if (parseInt(req.body.rating) < 0 || parseInt(req.body.rating) > 2) {
      throw new MissingParamError('Rating should be between 0 and 2')
    }
  }

  await Ingredient.update(req.params.id, req.body)
  const ingredient = await Ingredient.findOneOrFail(req.params.id)
  res.status(200).json(ingredient)
}

export const setIngredientImage: RequestHandler = async (req, res) => {
  if (!req.file) throw new MissingParamError('An image is needed')
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
