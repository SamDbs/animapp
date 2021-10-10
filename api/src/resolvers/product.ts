import { Arg, Info, Query, Resolver } from 'type-graphql'

import Product from '../models/product'

@Resolver()
export default class ProductResolver {
  @Query(() => Product)
  product(@Arg('id') id: string, @Info() ctx: any): ReturnType<typeof Product['findOne']> {
    console.log(
      'ctx',
      JSON.stringify(
        ctx.operation.selectionSet.selections
          .find((y: any) => y.name.value === 'product')
          .selectionSet.selections.map((x: any) => x.name.value),
      ),
    )
    return Product.findOne(id)
  }

  @Query(() => [Product])
  products(): ReturnType<typeof Product['find']> {
    return Product.find()
  }
}
