import { RequestHandler } from 'express'
import { ILike } from 'typeorm'

import { viewProducts } from '../views/product'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import IngredientTranslation from '../models/ingredientTranslation'

import { NotFoundError } from './errorHandler'

export const searchAll: RequestHandler = async (req, res) => {
  const { language, q } = req.query
  const products = await Product.find({
    where: { name: ILike(`%${q}%`) },
    relations: ['translations'],
  })

  const ingredients = await IngredientTranslation.createQueryBuilder('t')
    .innerJoinAndSelect('t.ingredient', 'ingredient')
    .leftJoinAndSelect('ingredient.translations', 'ts')
    .where('t.name ILike :q', { q: `%${q}%` })
    .getMany()

  if (!products.length && !ingredients.length) {
    throw new NotFoundError()
  }

  res.json({
    ingredients: viewIngredients(
      ingredients.map((i) => i.ingredient),
      language?.toString().toUpperCase(),
    ),
    products: viewProducts(products, language?.toString().toUpperCase()),
  })
}
