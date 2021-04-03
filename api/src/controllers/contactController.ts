import { RequestHandler } from 'express'

import Contact from '../models/contact'
import { viewContact, viewContacts } from '../views/contact'

export const getAllContacts: RequestHandler = async (req, res) => {
  try {
    const contacts = await Contact.find()
    res.json(viewContacts(contacts))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getContactById: RequestHandler = async (req, res) => {
  try {
    const contact = await Contact.findOne(req.params.id)
    if (!contact) {
      res.sendStatus(404)
      return
    }
    res.json(viewContact(contact))
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const createContact: RequestHandler = async (req, res) => {
  try {
    const contact = Contact.create(req.body as Contact)
    await contact.save()
    res.status(201).json(contact)
  } catch {
    res.sendStatus(400)
  }
}

export const deleteContact: RequestHandler = async (req, res) => {
  try {
    const contact = await Contact.findOneOrFail(req.params.id)
    if (!contact) {
      res.sendStatus(404)
      return
    }
    contact.softRemove()
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ error })
  }
}
