import { RequestHandler } from 'express'
import { ILike } from 'typeorm'

import { viewProducts } from '../views/product'
import Product from '../models/product'
import { NotFoundError } from '../middleware/errorHandler'
import Brand from '../models/brand'
import IngredientTranslation from '../models/ingredientTranslation'
import { viewIngredient } from '../views/ingredient'

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
  const { q } = req.query
  const queryDeleteParenthesis = q?.toString().replace(/\([^\)]*\)/gms, '')
  const formatQuery = queryDeleteParenthesis?.replace('\n', ',')
  const tableauMots = []
  const matches = formatQuery?.matchAll(/([a-zA-Z\s]+),?/gms)
  if (!matches) {
    return
  }
  for (const match of matches) {
    tableauMots.push(match[1].trim())
  }
  const searchResult = await Promise.all(
    tableauMots.map(async (mot) => {
      const ingredient = await IngredientTranslation.createQueryBuilder('t')
        .innerJoinAndSelect('t.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient.translations', 'ts')
        .where('t.name ILike :q', { q: `%${mot}%` })
        .getOne()
      return {
        ingredientSearched: mot,
        ingredientFound: ingredient ? viewIngredient(ingredient.ingredient) : null,
      }
    }),
  )
  res.json(searchResult)
}
