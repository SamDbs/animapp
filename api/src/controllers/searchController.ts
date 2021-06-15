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
  const filterByStatus: { published?: boolean } = {}
  if (!res.locals.admin) {
    filterByStatus.published = true
  }

  const products = await Product.find({
    where: { name: ILike(`%${q}%`), ...filterByStatus },
    relations: ['translations', 'brand'],
  })

  const brands = await Brand.find({
    where: { name: ILike(`%${q}%`) },
    relations: ['products', 'products.translations', 'products.brand'],
  })
  const productsFromBrand = brands
    .map((brand) => brand.products)
    .flat()
    .filter((product) => {
      if (products.map((pro) => pro.id).includes(product.id)) return false
      if (!res.locals.admin) {
        return product.published
      }
      return true
    })

  res.json({
    products: viewProducts([...productsFromBrand, ...products], language?.toString().toUpperCase()),
  })
}
export const searchByIngredients: RequestHandler = async (req, res) => {
  const { language, q } = req.query
  if (typeof q !== 'string') {
    throw new NotFoundError()
  }
  const tableauMots = parseQueryToWordArray(q)
  const searchResult = await Promise.all(
    tableauMots.map(async (mot) => {
      const ingredient = await IngredientTranslation.createQueryBuilder('t')
        .innerJoinAndSelect('t.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient.translations', 'ts')
        .where('t.name ILike :q', { q: `%${mot}%` })
        .getOne()
      return {
        ingredientSearched: mot,
        ingredientFound: ingredient
          ? viewIngredient(ingredient.ingredient, language?.toString().toUpperCase())
          : null,
      }
    }),
  )
  res.json(searchResult)
}

export const parseQueryToWordArray = (q: string): string[] => {
  const queryDeleteParenthesis = q?.replace(/\([^\)]*\)/gms, '')
  const formatQuery = queryDeleteParenthesis?.replace('\n', ',')
  const tableauMots = []
  const matches = formatQuery?.matchAll(/([a-zA-Z\s]+),?/gms)
  if (!matches) {
    return []
  }
  for (const match of matches) {
    tableauMots.push(match[1].trim())
  }
  return tableauMots
}
