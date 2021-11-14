import { RequestHandler } from 'express'

import Image from '../models/image'
import Ingredient from '../models/ingredient'
import { MissingParamError } from '../middleware/errorHandler'

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
