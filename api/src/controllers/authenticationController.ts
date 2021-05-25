import { compare } from 'bcryptjs'
import { RequestHandler } from 'express'
import { sign } from 'jsonwebtoken'

import { NotAuthorizedError } from '../middleware/errorHandler'
import Admin from '../models/admin'

export const authenticate: RequestHandler = async (req, res) => {
  const admin = await Admin.findOne({ where: { login: req.body.login } })

  if (!admin) throw new NotAuthorizedError()

  const passwordIsCorrect = await compare(req.body.password, admin.password)

  if (!passwordIsCorrect) throw new NotAuthorizedError()

  const jwt = sign(admin.id.toString(), process.env.AUTH_SECRET_KEY as string)
  res.json({ jwt })
  return
}
