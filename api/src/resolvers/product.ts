import { Arg, Query, Resolver } from 'type-graphql'

import Product from '../models/product'

@Resolver()
export default class ProductResolver {
  @Query(() => Product)
  product(@Arg('id') id: string): ReturnType<typeof Product['findOne']> {
    return Product.findOne(id)
  }

  @Query(() => [Product])
  products(): ReturnType<typeof Product['find']> {
    return Product.find()
  }
}
