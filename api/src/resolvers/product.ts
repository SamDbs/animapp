import { Arg, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import Product from '../models/product'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductIngredient from '../models/productIngredients'

@Resolver(() => Product)
export default class ProductResolver {
  @Query(() => Product)
  product(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Product> {
    return Product.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Product),
    })
  }

  @Query(() => [Product])
  products(): Promise<Product[]> {
    return Product.find()
  }

  @FieldResolver()
  ingredients(@Root() product: Product): Promise<ProductIngredient[]> {
    return ProductIngredient.find({ where: { productId: product.id } })
  }
}
