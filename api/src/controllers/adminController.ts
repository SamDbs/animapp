import { RequestHandler } from 'express'
import { genSalt, hash } from 'bcryptjs'

import Admin from '../models/admin'

export const createAdmin: RequestHandler = async (req, res) => {
  const salt = await genSalt()
  const admin = Admin.create({
    login: req.body.login,
    password: await hash(req.body.password, salt),
  })
  await admin.save()
  res.status(201).json(admin)
}
