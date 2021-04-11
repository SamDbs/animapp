import { RequestHandler } from 'express'
import { ILike } from 'typeorm'

import { viewProducts } from '../views/product'
import Product from '../models/product'
import { NotFoundError } from '../middleware/errorHandler'
import Brand from '../models/brand'
import IngredientTranslation from '../models/ingredientTranslation'

export const searchAll: RequestHandler = async (req, res) => {
  const { language, q } = req.query
  const products = await Product.find({
    where: { name: ILike(`%${q}%`) },
    relations: ['translations', 'brand'],
  })

  const brands = await Brand.find({
    where: { name: ILike(`%${q}%`) },
    relations: ['products', 'products.translations', 'products.brand'],
  })

  if (!products.length && !brands.length) {
    throw new NotFoundError()
  }
  res.json({
    products: viewProducts(
      [...products, ...brands.map((brand) => brand.products).flat()],
      language?.toString().toUpperCase(),
    ),
  })
}
export const searchByIngredients: RequestHandler = async (req, res) => {
  const { language, q } = req.query
  const queryDeleteParenthesis = req.query.q?.toString().replace(/\(.*\)/Ugms, '')
  const queryWord = queryDeleteParenthesis?.split(',').map((item) => item.trim())
  const queryWord2 = queryDeleteParenthesis?.split(';').map((item) => item.trim())
  const queryWord3 = queryDeleteParenthesis?.split('\n').map((item) => item.trim())

  const ingredients = await IngredientTranslation.createQueryBuilder('t')
    .innerJoinAndSelect('t.ingredient', 'ingredient')
    .leftJoinAndSelect('ingredient.translations', 'ts')
    .where('t.name ILike :q', { q: `%${q}%` })
    .getMany()
}
