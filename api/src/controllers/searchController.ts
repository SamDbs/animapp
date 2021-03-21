import { RequestHandler } from 'express'
import { ILike } from 'typeorm'

import { viewProducts } from '../views/product'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import IngredientTranslation from '../models/ingredientTranslation'

export const searchAll: RequestHandler = async (req, res) => {
  const { language, q } = req.query
  try {
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
      res.sendStatus(404)
      return
    }

    res.json({
      ingredients: viewIngredients(
        ingredients.map((i) => i.ingredient),
        language as string,
      ),
      products: viewProducts(products, language as string),
    })
  } catch (error) {
    res.status(500).json({ error })
  }
}
