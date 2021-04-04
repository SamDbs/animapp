import { Response } from 'express'
import { EntityNotFoundError } from 'typeorm'
import { EntityColumnNotFound } from 'typeorm/error/EntityColumnNotFound'

export function viewError(error: Error, response: Response) {
  if (response.locals.isAdmin) {
    response.status(500).json(error)
    return
  }
  if (error instanceof EntityColumnNotFound) {
    response.status(500).json({ message: 'Bad request' })
    return
  }
  if (error instanceof EntityNotFoundError) {
    response.status(404).json({ message: 'Entity not found' })
    return
  }
  response.status(500).json(error)
}
