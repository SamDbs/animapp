import { FindOperator } from 'typeorm'
import { RequestHandler } from 'express'

import Contact from '../models/contact'
import { viewContact, viewContacts } from '../views/contact'

const limit = 5

export const getAllContacts: RequestHandler = async (req, res) => {
  const desiredPage = parseInt(req.query?.page?.toString() ?? '0')
  const page = desiredPage < 0 ? 0 : desiredPage
  const offset = limit * page

  if (req.query.q) {
    const [contacts, count] = await Contact.findAndCount({
      where: [
        { email: new FindOperator('ilike', `%${req.query.q}%`) },
        { name: new FindOperator('ilike', `%${req.query.q}%`) },
        { message: new FindOperator('ilike', `%${req.query.q}%`) },
      ],
      take: limit,
      skip: offset,
    })
    res.json({ pagination: { count, limit, offset, page }, contacts: viewContacts(contacts) })
    return
  }
  const [contacts, count] = await Contact.findAndCount({ take: limit, skip: offset })
  res.json({ pagination: { count, limit, offset, page }, contacts: viewContacts(contacts) })
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
