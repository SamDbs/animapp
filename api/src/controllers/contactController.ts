import { FindManyOptions, FindOperator } from 'typeorm'
import { Request, RequestHandler } from 'express'

import Contact from '../models/contact'
import { viewContact, viewContacts } from '../views/contact'

const allowedContactFilterKeys: (keyof Contact)[] = ['id', 'name', 'email', 'message']
function GetAllowedContactFilters(key: string): key is keyof Contact {
  return allowedContactFilterKeys.includes(key as keyof Contact)
}

function getFilters(query: Request['query']): FindManyOptions<Contact> | undefined {
  const where: FindManyOptions<Contact>['where'] = {}
  const options: FindManyOptions<Contact> = { where }

  Object.entries(query).forEach(([key, value]) => {
    if (key && GetAllowedContactFilters(key)) {
      if (key === 'name' || key === 'email' || key === 'message')
        where[key] = new FindOperator('ilike', `%${value}%`)
      else where[key] = value
    }
  })

  if (!Object.keys(where).length) return

  return options
}

export const getAllContacts: RequestHandler = async (req, res) => {
  const filters = getFilters(req.query)
  const contacts = await Contact.find(filters)
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
