import { RequestHandler } from 'express'

import Product from '../models/product'
import Image from '../models/image'
import { MissingParamError } from '../middleware/errorHandler'

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
