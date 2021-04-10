import { RequestHandler } from 'express'

export const authAdmin: RequestHandler = async (req, res, next) => {
  console.log('hello')
}
