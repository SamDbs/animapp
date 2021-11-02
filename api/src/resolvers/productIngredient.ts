import { Arg, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductIngredient from '../models/productIngredients'
import Ingredient from '../models/ingredient'

@Resolver(() => ProductIngredient)
export default class ProductIngredientResolver {
  @Query(() => ProductIngredient)
  productIngredient(
    @Arg('productId') productId: string,
    @Arg('ingredientId') ingredientId: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProductIngredient> {
    return ProductIngredient.findOneOrFail({
      select: getSelectedFieldsFromForModel(info, ProductIngredient),
      where: { productId, ingredientId },
    })
  }

  @Query(() => [ProductIngredient])
  productIngredients(@Arg('productId') productId: string): Promise<ProductIngredient[]> {
    return ProductIngredient.find({ where: { productId } })
  }

  @FieldResolver()
  async ingredient(@Root() productIngredient: ProductIngredient): Promise<Ingredient> {
    return Ingredient.findOneOrFail({ where: { id: productIngredient.ingredientId } })
  }
}
