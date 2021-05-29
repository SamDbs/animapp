import { FindOperator } from 'typeorm'
import { RequestHandler } from 'express'

import Brand from '../models/brand'
import { ConflictError } from '../middleware/errorHandler'

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
  if (req.query.q) {
    const brands = await Brand.find({
      where: [{ name: new FindOperator('ilike', `%${req.query.q}%`) }],
      order: { id: 'ASC' },
    })
    res.json(brands)
    return
  }
  const brands = await Brand.find()
  res.json(brands)
}

export const getBrandById: RequestHandler = async (req, res) => {
  console.log('hello')
  const brand = await Brand.findOneOrFail(req.params.id)
  res.json(brand)
}

export const createBrand: RequestHandler = async (req, res) => {
  const brand = Brand.create(req.body as Brand)
  await brand.save()
  res.status(201).json(brand)
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
