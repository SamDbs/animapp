import { ErrorRequestHandler } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'
import { EntityColumnNotFound } from 'typeorm/error/EntityColumnNotFound'

export class NotFoundError extends Error {}
export class NotAuthorizedError extends Error {}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.locals.admin) {
    res.status(500).json(error)
    return
  }
  if (error instanceof EntityColumnNotFound) {
    res.status(500).json({ message: 'Bad request' })
    return
  }
  if (error instanceof EntityNotFoundError || error instanceof NotFoundError) {
    res.status(404).json({ message: 'Entity not found' })
    return
  }
  if (error instanceof QueryFailedError) {
    res.status(400).json({ message: 'Bad request' })
    return
  }
  if (
    error instanceof NotAuthorizedError ||
    error instanceof JsonWebTokenError ||
    error instanceof TokenExpiredError
  ) {
    res.status(401).json({ message: 'Not Authorized' })
    return
  }

  res.status(500).json(error)
}