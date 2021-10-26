import { Brackets, FindManyOptions, QueryFailedError } from 'typeorm'
import { Request, RequestHandler } from 'express'

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
import { ConflictError, MissingParamError } from '../middleware/errorHandler'
import Ingredient from '../models/ingredient'
import ProductIngredient from '../models/productIngredients'

const PG_UNIQUE_CHECK_ERROR_CODE = '23505'

const limit = 10

const allowedProductFilterKeys: (keyof Product)[] = ['published']
function GetAllowedProductFilters(key: string): key is keyof Product {
  return allowedProductFilterKeys.includes(key as keyof Product)
}

function makeWhereFilter(query: Request['query']): FindManyOptions<Product>['where'] {
  const where: FindManyOptions<Product>['where'] = {}

  Object.entries(query).forEach(([key, value]) => {
    if (key && GetAllowedProductFilters(key)) {
      where[key] = value
    }
  })

  if (!Object.keys(where).length) return {}

  return where
}

export const getAllProducts: RequestHandler = async (req, res) => {
  const desiredPage = parseInt(req.query?.page?.toString() ?? '0')
  const page = desiredPage < 0 ? 0 : desiredPage
  const offset = limit * page

  const filters = makeWhereFilter(req.query) as any

  if (req.query.q) {
    const formatQuery = req.query.q.toString().split(' ')
    const queryTranslations =
      ProductTranslation.createQueryBuilder('pT').where("pT.languageId = 'EN'")
    formatQuery.forEach((x) => queryTranslations.andWhere('pT.description ilike :x', { x }))

    console.log('formatQuery', formatQuery)
    const translations = await queryTranslations.getMany()

    const productIds = translations.map((translation) => translation.productId)

    const queryProduct = Product.createQueryBuilder('p')

    if (filters.published === '1' || filters.published === '0') {
      queryProduct.where('p.published = :published', { published: filters.published })
    }

    queryProduct.andWhere(
      new Brackets((qb) => {
        qb.where('p.id IN (:...productIds)', {
          productIds: [...productIds, null],
        })
        qb.orWhere(
          new Brackets((qb) => {
            formatQuery.forEach((x, index) => {
              if (index === 0) qb.where('p.name ilike :x', { x: `%${x}%` })
              else qb.andWhere('p.name ilike :x', { x: `%${x}%` })
            })
          }),
        )
      }),
    )

    const [products, count] = await queryProduct
      .leftJoinAndSelect('p.translations', 'pT')
      .leftJoinAndSelect('p.brand', 'brand')
      .limit(limit)
      .offset(offset)
      .orderBy('p.name', 'ASC')
      .getManyAndCount()

    res.json({
      pagination: { count, limit, offset, page },
      products: viewProducts(products, req.params.lang?.toString()),
    })
    return
  }

  const [products, count] = await Product.findAndCount({
    where: filters,
    relations: ['translations', 'brand'],
    order: { name: 'ASC' },
    take: limit,
    skip: offset,
  })

  res.json({
    pagination: { count, limit, offset, page },
    products: viewProducts(products, req.params.lang?.toString()),
  })
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

  try {
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    if (err instanceof QueryFailedError) {
      if ((err as any).code === PG_UNIQUE_CHECK_ERROR_CODE) {
        throw new ConflictError('This product already exists.')
      }
    }
    throw err
  }
}

export const patchProduct: RequestHandler = async (req, res) => {
  await Product.update(req.params.id, req.body)
  const product = await Product.findOneOrFail(req.params.id)
  res.status(200).json(product)
}

export const setProductImage: RequestHandler = async (req, res) => {
  if (!req.file) throw new MissingParamError('An image is needed')

  const product = await Product.findOneOrFail(req.params.id)
  const existingImage = await Image.findOne({ where: { productId: product.id } })

  const img = existingImage || Image.create({ productId: product.id })

  img.image = req.file.buffer
  img.url = `${process.env.HOST_URL}/products/${product.id}/image`
  img.type = req.file.mimetype

  await img.save()
  const { image, ...otherFields } = img
  res.status(200).json(otherFields)
}

export const getProductImage: RequestHandler = async (req, res) => {
  const product = await Product.findOneOrFail(req.params.id)
  const img = await Image.findOneOrFail({ where: { productId: product.id } })
  res.status(200).set('Content-Type', img.type).send(img.image)
}

export const getProductIngredients: RequestHandler = async (req, res) => {
  const relations = await ProductIngredient.createQueryBuilder('p')
    .where('"productId" = :id', { id: req.params.id })
    .orderBy('p.order', 'ASC')
    .leftJoinAndSelect('p.ingredient', 'ingredient')
    .leftJoinAndSelect('ingredient.translations', 'translations')
    .getMany()

  const { language } = req.query
  res.json({
    ingredients: viewIngredients(
      relations.map((x) => x.ingredient),
      language?.toString().toUpperCase(),
    ),
    relations: relations.map((x) => ({
      ingredientId: x.ingredientId,
      order: x.order,
      productId: x.productId,
      quantity: x.quantity,
    })),
  })
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

export const getACByProduct: RequestHandler = async (req, res) => {
  const relations = await ProductAnalyticalConstituent.createQueryBuilder('a')
    .where('"productId" = :id', { id: req.params.id })
    .leftJoinAndSelect('a.analyticalConstituent', 'analyticalConstituent')
    .leftJoinAndSelect('analyticalConstituent.translations', 'translations')
    .getMany()
  const { language } = req.query
  res.json({
    analyticalConstituents: viewAnalyticalConstituentsClient(
      relations.map((x) => x.analyticalConstituent),
      language?.toString().toUpperCase(),
    ),
    relations: relations.map((x) => ({
      productId: x.productId,
      constituentId: x.analyticalConstituentId,
      quantity: x.quantity,
    })),
  })
}

export const deleteProductACQuantity: RequestHandler = async (req, res) => {
  const relation = await ProductAnalyticalConstituent.findOneOrFail({
    productId: parseInt(req.params.id),
    analyticalConstituentId: parseInt(req.params.idAC),
  })
  relation.quantity = null
  await relation.save()
  relation.softRemove()
  res.sendStatus(200)
}

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
  const ingredient = await Ingredient.findOneOrFail(req.params.ingredientId)

  const product = await Product.createQueryBuilder('p')
    .select(['p.id', 'p.name', 'pi.order'])
    .where('p.id = :id', { id: req.params.id })
    .leftJoin('p.ingredients', 'pi')
    .getOneOrFail()

  const existingRelation = await ProductIngredient.findOne({
    where: { productId: product.id, ingredientId: ingredient.id },
  })

  const relation =
    existingRelation ||
    ProductIngredient.create({
      productId: product.id,
      ingredientId: ingredient.id,
    })

  if (req.body.quantity) relation.quantity = req.body.quantity

  relation.order = Math.max(0, ...product.ingredients.map((ir) => ir.order)) + 1

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

export const setProductsIngredientOrder: RequestHandler = async (req, res) => {
  await Promise.all(
    req.body.map(
      (item: { ingredientId: Ingredient['id']; productId: Product['id']; order: number }) => {
        const { ingredientId, order, productId } = item
        return ProductIngredient.update({ ingredientId, productId }, { order })
      },
    ),
  )

  res.sendStatus(200)
}
