import { RequestHandler } from 'express'
import { verify } from 'jsonwebtoken'
import NodeCache from 'node-cache'
import { AuthChecker } from 'type-graphql'

import Admin from '../models/admin'

import { NotAuthorizedError } from './errorHandler'

const authAdminCache = new NodeCache({ stdTTL: 600, checkperiod: 600 })

const introspectionQueries = [
  '{\n        __schema {\n          queryType {\n            kind\n          }\n        }\n      }',
  'query IntrospectionQuery {\n  __schema {\n    queryType {\n      name\n    }\n    mutationType {\n      name\n    }\n    subscriptionType {\n      name\n    }\n    types {\n      ...FullType\n    }\n    directives {\n      name\n      description\n      locations\n      args {\n        ...InputValue\n      }\n    }\n  }\n}\n\nfragment FullType on __Type {\n  kind\n  name\n  description\n  fields(includeDeprecated: true) {\n    name\n    description\n    args {\n      ...InputValue\n    }\n    type {\n      ...TypeRef\n    }\n    isDeprecated\n    deprecationReason\n  }\n  inputFields {\n    ...InputValue\n  }\n  interfaces {\n    ...TypeRef\n  }\n  enumValues(includeDeprecated: true) {\n    name\n    description\n    isDeprecated\n    deprecationReason\n  }\n  possibleTypes {\n    ...TypeRef\n  }\n}\n\nfragment InputValue on __InputValue {\n  name\n  description\n  type {\n    ...TypeRef\n  }\n  defaultValue\n}\n\nfragment TypeRef on __Type {\n  kind\n  name\n  ofType {\n    kind\n    name\n    ofType {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n',
]

export const authAdmin: RequestHandler = async (req, res, next) => {
  if (req.originalUrl === '/graphql' && req.body.query) {
    const query: string = req.body.query

    const isIntrospectionQuery = introspectionQueries.includes(query)

    if (isIntrospectionQuery) {
      next()
      return
    }
  }

  if (!res.locals.admin) {
    throw new NotAuthorizedError()
  }
  next()
}

export const isConnected: RequestHandler = async (req, res, next) => {
  const authorize = req.header('Authorization')
  if (authorize) {
    const adminId = verify(authorize, process.env.AUTH_SECRET_KEY as string) as string
    let admin = authAdminCache.get(adminId)
    if (typeof admin === 'undefined') {
      admin = await Admin.findOneOrFail(adminId)
      authAdminCache.set(adminId, admin ?? null)
    }
    res.locals.admin = admin
  }
  next()
}

type ContextType = { admin: any }

export const authChecker: AuthChecker<ContextType> = ({ args, context, info, root }, roles) => {
  if (!context.admin) return false

  return true
}
