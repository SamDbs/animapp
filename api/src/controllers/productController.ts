import { FindManyOptions, FindOperator, In } from 'typeorm'
import { RequestHandler } from 'express'

import {
  viewAnalyticalConstituent,
  viewAnalyticalConstituents,
  viewProduct,
  viewProducts,
  viewProductTranslation,
  viewProductTranslations,
} from '../views/product'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import ProductTranslation from '../models/productTranslation'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
import AnalyticalConstituent from '../models/analyticalConstituent'
import Image from '../models/image'
import { MissingParamError } from '../middleware/errorHandler'
import Ingredient from '../models/ingredient'

export const getAllProducts: RequestHandler = async (req, res) => {
  if (req.query.q) {
    const translations = await ProductTranslation.find({
      where: { description: new FindOperator('ilike', `%${req.query.q}%`), languageId: 'EN' },
    })

    const productIds = translations.map((translation) => translation.productId)
    const where: FindManyOptions<Product>['where'] = [
      { id: In(productIds) },
      { name: new FindOperator('ilike', `%${req.query.q}%`) },
    ]

    console.log('okokkkk')
    const products = await Product.find({
      relations: ['translations'],
      order: { id: 'ASC' },
      where,
    })
    console.log('okokkkk 2')
    res.json(viewProducts(products, req.params.lang?.toString()))
    return
  }

  const products = await Product.find({
    relations: ['translations'],
    order: { id: 'ASC' },
  })
  res.json(viewProducts(products, req.query.lang?.toString()))
}

export const getProductById: RequestHandler = async (req, res) => {
  const product = await Product.createQueryBuilder('product')
    .where('product.id = :id', { id: req.params.id })
    .leftJoinAndSelect('product.translations', 'pt')
    .leftJoinAndSelect('product.brand', 'bd')
    .leftJoinAndSelect('product.image', 'img')
    .getOneOrFail()

  product.analyticalConstituents = await ProductAnalyticalConstituent.createQueryBuilder('a')
    .where('"productId" = :id', { id: req.params.id })
    .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
    .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
    .getMany()

  const { language } = req.query
  res.json(viewProduct(product, language?.toString().toUpperCase()))
}

export const createProduct: RequestHandler = async (req, res) => {
  if (!req.body.name) throw new MissingParamError('A product needs a name')

  const product = Product.create(req.body as Product)
  await product.save()
  res.status(201).json(product)
}

export const patchProduct: RequestHandler = async (req, res) => {
  await Product.update(req.params.id, req.body)
  const product = await Product.findOneOrFail(req.params.id)
  console.log('ok', product)
  res.status(200).json(product)
}

export const setProductImage: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  const existingImage = await Image.findOne({ where: { productId: product.id } })

  const img = existingImage || Image.create({ productId: product.id })

  img.image = req.file.buffer
  img.url = `${process.env.HOST_URL}/products/${product.id}/image`
  img.type = req.file.mimetype

  await img.save()
  res.status(200).json(img)
}

export const getProductImage: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  const img = await Image.findOneOrFail({ where: { productId: product.id } })
  res.status(200).set('Content-Type', img.type).send(img.image)
}

export const getIngredientsByProduct: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id, {
    relations: ['ingredients', 'ingredients.translations'],
  })
  res.json(viewIngredients(product.ingredients))
}

export const deleteProduct: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  product.softRemove()
  res.sendStatus(200)
}

// Create relation between product and AC + add quantity
export const createProductACQuantity: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  const aC = await AnalyticalConstituent.findOneOrFail(req.params.idAC)
  const relation = ProductAnalyticalConstituent.create({
    productId: product.id,
    analyticalConstituentId: aC.id,
    quantity: req.body.quantity,
  } as ProductAnalyticalConstituent)
  await relation.save()

  res.status(201).json(relation)
}

// View that returns product's analytical constituents
export const getACByProduct: RequestHandler = async (req, res) => {
  const analyticalConstituents = await ProductAnalyticalConstituent.createQueryBuilder('a')
    .where('"productId" = :id', { id: req.params.id })
    .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
    .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
    .getMany()

  const { language } = req.query
  res.json(viewAnalyticalConstituents(analyticalConstituents, language?.toString().toUpperCase()))
}

export const patchACByProduct: RequestHandler = async (req, res) => {
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

  res.status(200).json(viewAnalyticalConstituent(relation))
}

export const deleteProductACQuantity: RequestHandler = async (req, res) => {
  const relation = await ProductAnalyticalConstituent.findOneOrFail({
    productId: parseInt(req.params.id),
    analyticalConstituentId: parseInt(req.params.idAC),
  })
  relation.softRemove()
  res.sendStatus(200)
}

// CRUD Translations
export const createProductTranslation: RequestHandler = async (req, res) => {
  const translation = ProductTranslation.create({
    languageId: req.body.languageId.toUpperCase(),
    description: req.body.description,
  } as ProductTranslation)
  translation.productId = parseInt(req.params.id)
  await translation.save()

  res.status(201).json(translation)
}

export const getAllProductTranslations: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id, {
    relations: ['translations'],
  })
  res.json(viewProductTranslations(product.translations))
}

export const patchProductTranslation: RequestHandler = async (req, res) => {
  await ProductTranslation.update(
    { productId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
    req.body,
  )
  const productTranslation = await ProductTranslation.findOneOrFail({
    where: { productId: parseInt(req.params.id), languageId: req.params.lang.toUpperCase() },
  })
  res.status(200).json(viewProductTranslation(productTranslation))
}

export const deleteProductTranslation: RequestHandler = async (req, res) => {
  const productTranslation = await ProductTranslation.findOneOrFail({
    productId: parseInt(req.params.id),
    languageId: req.params.lang.toUpperCase(),
  })
  productTranslation.softRemove()
  res.sendStatus(200)
}

export const updateProductIngredients: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id, {
    relations: ['ingredients'],
  })

  const alreadyExists = product.ingredients
    .map((i) => i.id.toString())
    .includes(req.body.ingredientId.toString())

  if (alreadyExists) {
    product.ingredients = product.ingredients.filter(
      (i) => i.id.toString() !== req.body.ingredientId.toString(),
    )
  } else {
    const ingredient = await Ingredient.findOneOrFail(req.body.ingredientId)
    product.ingredients.push(ingredient)
  }
  await product.save()
  getIngredientsByProduct(req, res, () => null)
}
