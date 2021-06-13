import { FindManyOptions, FindOperator, In } from 'typeorm'
import { RequestHandler } from 'express'

import {
  viewProduct,
  viewProducts,
  viewProductTranslation,
  viewProductTranslations,
} from '../views/product'
import { viewAnalyticalConstituentsClient } from '../views/analyticalConstituent'
import { viewIngredients } from '../views/ingredient'
import Product from '../models/product'
import ProductTranslation from '../models/productTranslation'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
import AnalyticalConstituent from '../models/analyticalConstituent'
import Image from '../models/image'
import { MissingParamError } from '../middleware/errorHandler'
import Ingredient from '../models/ingredient'
import ProductIngredient from '../models/productIngredients'

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

export const getBrandByProductIdx: RequestHandler = async (req, res) => {
  const product = await Product.createQueryBuilder('product')
    .where('product.id = :id', { id: req.params.id })
    .leftJoinAndSelect('product.brand', 'bd')
    .getOneOrFail()

  res.json(product.brand)
}

export const updateBrandInProductIdx: RequestHandler = async (req, res) => {
  await Product.update(req.params.id, { brandId: req.body.brandId })
  res.sendStatus(204)
}

export const createProduct: RequestHandler = async (req, res) => {
  if (!req.body.name) throw new MissingParamError('A product needs a name')
  if (!req.body.brandId) throw new MissingParamError('A product needs a brand')

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
  const ingredients = await ProductIngredient.createQueryBuilder('a')
    .where('"productId" = :id', { id: req.params.id })
    .leftJoinAndSelect('a.ingredient', 'ingredient')
    .leftJoinAndSelect('ingredient.translations', 'translations')
    .getMany()

  const { language } = req.query
  res.json(
    viewIngredients(
      ingredients.map((x) => x.ingredient),
      language?.toString().toUpperCase(),
    ),
  )
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

  const existingRelation = await ProductAnalyticalConstituent.findOne({
    where: { productId: product.id, analyticalConstituentId: aC.id },
  })
  const relation =
    existingRelation ||
    ProductAnalyticalConstituent.create({
      productId: product.id,
      analyticalConstituentId: aC.id,
      deletedAt: null,
    } as ProductAnalyticalConstituent)

  if (req.body.quantity) relation.quantity = req.body.quantity

  await relation.save()

  res.status(201).json(relation)
}

// View that returns product's analytical constituents
export const getACByProduct: RequestHandler = async (req, res) => {
  const relations = await ProductAnalyticalConstituent.createQueryBuilder('a')
    .where('"productId" = :id', { id: req.params.id })
    .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
    .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
    .getMany()

  const { language } = req.query
  res.json(
    viewAnalyticalConstituentsClient(
      relations.map((x) => x.analyticalConstituent),
      language?.toString().toUpperCase(),
    ),
  )
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

export const upsertProductIngredient: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  const ingredient = await Ingredient.findOneOrFail(req.params.ingredientId)

  const existingRelation = await ProductIngredient.findOne({
    where: { productId: product.id, ingredientId: ingredient.id },
  })

  const relation =
    existingRelation ||
    ProductIngredient.create({
      productId: product.id,
      ingredientId: ingredient.id,
      deletedAt: null,
    } as ProductIngredient)

  if (req.body.quantity) relation.quantity = req.body.quantity

  await relation.save()

  res.status(201).json(relation)
}

export const deleteProductIngredient: RequestHandler = async (req, res) => {
  const relation = await ProductIngredient.findOneOrFail({
    productId: parseInt(req.params.id),
    ingredientId: parseInt(req.params.ingredientId),
  })
  relation.softRemove()
  res.sendStatus(200)
}
