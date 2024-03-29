import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'

import Admin from '../models/admin'

import { NotAuthorizedError } from './errorHandler'

export const authAdmin: RequestHandler = async (req, res, next) => {
  if (!res.locals.admin) {
    throw new NotAuthorizedError()
  }
  next()
}

export const isConnected: RequestHandler = async (req, res, next) => {
  const authorize = req.header('Authorization')
  if (authorize) {
    const adminId = verify(authorize, process.env.AUTH_SECRET_KEY as string) as string
    const admin = await Admin.findOneOrFail(adminId)
    res.locals.admin = admin
  }
  next()
}
