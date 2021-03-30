import { FindManyOptions } from 'typeorm'
import { Request, RequestHandler } from 'express'

import { viewProduct, viewProductTranslation, viewProductTranslations } from '../views/product'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import ProductTranslation from '../models/productTranslation'

const allowedProductFilterKeys: (keyof Product)[] = ['id', 'name', 'barCode']
function GetAllowedProductFilters(key: string): key is keyof Product {
  return allowedProductFilterKeys.includes(key as keyof Product)
}

function getFilters(query: Request['query']): FindManyOptions<Product> | undefined {
  const where: FindManyOptions<Product>['where'] = {}
  const options: FindManyOptions<Product> = { where }

  Object.entries(query).forEach(([key, value]) => {
    if (key && GetAllowedProductFilters(key)) {
      where[key] = value
    } else throw new Error(`Cannot filter on ${key}.`)
  })

  if (!Object.keys(where).length) return

  return options
}

export const getAllProducts: RequestHandler = async (req, res) => {
  let filters
  try {
    filters = getFilters(req.query)
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }

  try {
    const products = await Product.find(filters)
    res.json(products)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getProductById: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findOne(req.params.id, { relations: ['translations'] })
    if (!product) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query

    res.json(viewProduct(product, language as string))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const product = Product.create(req.body as Product)
    await product.save()

    res.status(201).json(product)
  } catch {
    res.sendStatus(400)
  }
}

export const patchProduct: RequestHandler = async (req, res) => {
  try {
    await Product.update(req.params.id, req.body)
    const product = await Product.findOneOrFail(req.params.id)
    res.status(200).json(product)
  } catch {
    res.sendStatus(400)
  }
}

export const getIngredientsByProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findOneOrFail(req.params.id, {
      relations: ['ingredients', 'ingredients.translations'],
    })
    res.json(viewIngredients(product.ingredients))
  } catch (error) {
    res.sendStatus(400)
    console.log(error)
  }
}

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.delete(req.params.id)
    if (!product.affected) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createProductTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = ProductTranslation.create(req.body as ProductTranslation)
    translation.productId = parseInt(req.params.id)
    await translation.save()

    res.status(201).json(translation)
  } catch {
    res.sendStatus(400)
  }
}

export const getAllProductTranslations: RequestHandler = async (req, res) => {
  try {
    const productTranslations = await ProductTranslation.find({
      where: { productId: parseInt(req.params.id) },
    })
    if (productTranslations.length === 0) {
      res.sendStatus(404)
      return
    }
    res.json(viewProductTranslations(productTranslations))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const patchProductTranslation: RequestHandler = async (req, res) => {
  try {
    await ProductTranslation.update(
      { productId: parseInt(req.params.id), languageId: req.params.lang },
      req.body,
    )
    const productTranslation = await ProductTranslation.findOneOrFail({
      where: { productId: parseInt(req.params.id), languageId: req.params.lang },
    })
    if (!productTranslation) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(viewProductTranslation(productTranslation))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteProductTranslation: RequestHandler = async (req, res) => {
  try {
    const productTranslation = await ProductTranslation.delete({
      productId: parseInt(req.params.id),
      languageId: req.params.lang,
    })
    if (!productTranslation.affected) {
      res.sendStatus(404)
      return
    }
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
