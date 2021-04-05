import { RequestHandler } from 'express'

import Contact from '../models/contact'
import { viewContact, viewContacts } from '../views/contact'

export const getAllContacts: RequestHandler = async (req, res) => {
  const contacts = await Contact.find()
  res.json(viewContacts(contacts))
}

export const getContactById: RequestHandler = async (req, res) => {
  const contact = await Contact.findOneOrFail(req.params.id)
  res.json(viewContact(contact))
}

export const createContact: RequestHandler = async (req, res) => {
  const contact = Contact.create(req.body as Contact)
  await contact.save()
  res.status(201).json(contact)
}

export const deleteContact: RequestHandler = async (req, res) => {
  const contact = await Contact.findOneOrFail(req.params.id)
  contact.softRemove()
  res.sendStatus(200)
}
