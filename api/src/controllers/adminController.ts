import { RequestHandler } from 'express'

import Admin from '../models/admin'

export const createAdmin: RequestHandler = async (req, res) => {
  const admin = Admin.create({
    login: req.body.login,
  })
  await admin.setPassword(req.body.password)
  res.status(201).json(admin)
}
