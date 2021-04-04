import { FindManyOptions } from 'typeorm'
import { Request, RequestHandler } from 'express'

import {
  viewAnalyticalConstituent,
  viewAnalyticalConstituents,
  viewProduct,
  viewProductTranslation,
  viewProductTranslations,
} from '../views/product'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import ProductTranslation from '../models/productTranslation'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
import AnalyticalConstituent from '../models/analyticalConstituent'
import { viewError } from '../views/error'

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
    }
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
    const product = await Product.createQueryBuilder('product')
      .where('product.id = :id', { id: req.params.id })
      .leftJoinAndSelect('product.translations', 'pt')
      .getOneOrFail()

    product.analyticalConstituents = await ProductAnalyticalConstituent.createQueryBuilder('a')
      .where('"productId" = :id', { id: req.params.id })
      .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
      .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
      .getMany()
    if (!product) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query
    res.json(viewProduct(product, language?.toString().toUpperCase()))
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
    const product = await Product.findOneOrFail(req.params.id)
    if (!product) {
      res.sendStatus(404)
      return
    }
    product.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}

// Create relation between product and AC + add quantity
export const createProductACQuantity: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findOneOrFail(req.params.id)
    const aC = await AnalyticalConstituent.findOneOrFail(req.params.idAC)
    const relation = ProductAnalyticalConstituent.create({
      productId: product.id,
      analyticalConstituentId: aC.id,
      quantity: req.body.quantity,
    } as ProductAnalyticalConstituent)
    await relation.save()

    res.status(201).json(relation)
  } catch {
    res.sendStatus(400)
  }
}

// View that returns product's analytical constituents
export const getACByProduct: RequestHandler = async (req, res) => {
  try {
    const analyticalConstituents = await ProductAnalyticalConstituent.createQueryBuilder('a')
      .where('"productId" = :id', { id: req.params.id })
      .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
      .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
      .getMany()
    if (!analyticalConstituents) {
      res.sendStatus(404)
      return
    }
    const { language } = req.query
    res.json(viewAnalyticalConstituents(analyticalConstituents, language?.toString().toUpperCase()))
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
}

export const patchACByProduct: RequestHandler = async (req, res) => {
  try {
    await ProductAnalyticalConstituent.update(
      { productId: parseInt(req.params.id), analyticalConstituentId: parseInt(req.params.idAC) },
      req.body,
    )
    const relation = await ProductAnalyticalConstituent.createQueryBuilder('a')
      .where('"productId" = :id', { id: req.params.id })
      .andWhere('a."analyticalConstituentId" = :idAC', { idAC: req.params.idAC })
      .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
      .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
      .getOneOrFail()
    if (!relation) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(viewAnalyticalConstituent(relation))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const deleteProductACQuantity: RequestHandler = async (req, res) => {
  try {
    const relation = await ProductAnalyticalConstituent.findOneOrFail({
      productId: parseInt(req.params.id),
      analyticalConstituentId: parseInt(req.params.idAC),
    })
    relation.softRemove()
    res.sendStatus(200)
  } catch {
    res.sendStatus(400)
  }
}

// CRUD Translations
export const createProductTranslation: RequestHandler = async (req, res) => {
  try {
    const translation = ProductTranslation.create({
      languageId: req.body.languageId.toUpperCase(),
      description: req.body.description,
    } as ProductTranslation)
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
      { productId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
      req.body,
    )
    const productTranslation = await ProductTranslation.findOneOrFail({
      where: { productId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
    })
    if (!productTranslation) {
      res.sendStatus(404)
      return
    }
    res.status(200).json(viewProductTranslation(productTranslation))
  } catch (error) {
    viewError(error, res)
  }
}

export const deleteProductTranslation: RequestHandler = async (req, res) => {
  try {
    const productTranslation = await ProductTranslation.findOneOrFail({
      productId: parseInt(req.params.id),
      languageId: req.params.lang.toUpperCase(),
    })
    if (!productTranslation) {
      res.sendStatus(404)
      return
    }
    productTranslation.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
