import { RequestHandler } from 'express'

import Contact from '../models/contact'
import { viewContacts } from '../views/contact'

export const getAllContacts: RequestHandler = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.json(viewContacts(contacts))
  } catch (error) {
    res.status(500).json({ error })
  }
}
