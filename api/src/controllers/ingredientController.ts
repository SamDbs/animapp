import { RequestHandler } from 'express'

import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import {
  viewIngredient,
  viewIngredients,
  viewIngredientWithTranslations,
} from '../views/ingredient'

export const getAllIngredients: RequestHandler = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({ relations: ['translations'], order: { id: 'ASC' } })
    res.json(viewIngredients(ingredients, req.params.lang))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createIngredient: RequestHandler = async (req, res) => {
  try {
    const ingredient = Ingredient.create(req.body as Ingredient)
    await ingredient.save()
    res.status(201).json(ingredient)
  } catch {
    res.sendStatus(400)
  }
}

export const getIngredientById: RequestHandler = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne(req.params.id, { relations: ['translations'] })
    if (!ingredient) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query
    res.json(viewIngredient(ingredient, language as string))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const patchIngredient: RequestHandler = async (req, res) => {
  try {
    await Ingredient.update(req.params.id, req.body)
    const ingredient = await Ingredient.findOneOrFail(req.params.id)
    res.status(200).json(ingredient)
  } catch {
    res.sendStatus(400)
  }
}

export const deleteIngredient: RequestHandler = async (req, res) => {
  try {
    const ingredient = await Ingredient.delete(req.params.id)
    if (!ingredient.affected) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}

// CRUD Translations
export const getIngredientByIdWithTranslations: RequestHandler = async (req, res) => {
  try {
    const ingredient = await Ingredient.findOne(req.params.id, { relations: ['translations'] })
    if (!ingredient) {
      res.sendStatus(404)
      return
    }

    res.json(viewIngredientWithTranslations(ingredient))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createIngredientTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = IngredientTranslation.create(req.body as IngredientTranslation)
    translation.ingredientId = parseInt(req.params.id)
    await translation.save()
    res.status(201).json(translation)
  } catch {
    res.sendStatus(400)
  }
}
