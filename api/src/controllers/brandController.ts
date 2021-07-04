import { FindOperator, QueryFailedError } from 'typeorm'
import { RequestHandler } from 'express'

import Brand from '../models/brand'
import { ConflictError, MissingParamError } from '../middleware/errorHandler'

const PG_UNIQUE_CHECK_ERROR_CODE = '23505'

const limit = 5
// const allowedBrandFilterKeys: (keyof Brand)[] = ['id', 'name']
// function GetAllowedBrandFilters(key: string): key is keyof Brand {
//   return allowedBrandFilterKeys.includes(key as keyof Brand)
// }

// function getFilters(query: Request['query']): FindManyOptions<Brand> | undefined {
//   const where: FindManyOptions<Brand>['where'] = {}
//   const options: FindManyOptions<Brand> = { where }

//   Object.entries(query).forEach(([key, value]) => {
//     if (key && GetAllowedBrandFilters(key)) {
//       if (key === 'name') where[key] = new FindOperator('ilike', `%${value}%`)
//       else where[key] = value
//     }
//   })

//   if (!Object.keys(where).length) return

//   return options
// }

export const getAllBrands: RequestHandler = async (req, res) => {
  const desiredPage = parseInt(req.query?.page?.toString() ?? '0')
  const page = desiredPage < 0 ? 0 : desiredPage
  const offset = limit * page

  if (req.query.q) {
    const [brands, count] = await Brand.findAndCount({
      where: [{ name: new FindOperator('ilike', `%${req.query.q}%`) }],
      order: { name: 'ASC' },
      take: limit,
      skip: offset,
    })
    res.json({ pagination: { count, limit, offset, page }, brands })
    return
  }
  const [brands, count] = await Brand.findAndCount({
    order: { name: 'ASC' },
    take: limit,
    skip: offset,
  })
  res.json({ pagination: { count, limit, offset, page }, brands })
}

export const getBrandById: RequestHandler = async (req, res) => {
  const brand = await Brand.findOneOrFail(req.params.id)
  res.json(brand)
}

export const createBrand: RequestHandler = async (req, res) => {
  if (!req.body.name) throw new MissingParamError()
  const brand = Brand.create(req.body as Brand)

  try {
    await brand.save()
    res.status(201).json(brand)
  } catch (err) {
    if (err instanceof QueryFailedError) {
      if ((err as any).code === PG_UNIQUE_CHECK_ERROR_CODE) {
        throw new ConflictError('This brand already exists.')
      }
    }
    throw err
  }
}

export const patchBrand: RequestHandler = async (req, res) => {
  await Brand.update(req.params.id, req.body)
  const brand = await Brand.findOneOrFail(req.params.id)
  res.status(200).json(brand)
}

export const deleteBrand: RequestHandler = async (req, res) => {
  const brand = await Brand.createQueryBuilder('brand')
    .where('brand.id = :id', {
      id: req.params.id,
    })
    .leftJoinAndSelect('brand.products', 'products')
    .getOneOrFail()

  if (brand.products.length) {
    throw new ConflictError()
  }
  brand.softRemove()
  res.sendStatus(200)
}
