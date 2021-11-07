import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductIngredient from '../models/productIngredients'
import Ingredient from '../models/ingredient'

@ArgsType()
class AddIngredientToProductArgs implements Partial<ProductIngredient> {
  @Field(() => ID)
  productId!: number

  @Field(() => ID)
  ingredientId!: number

  @Field({ nullable: true })
  quantity?: string

  @Field(() => Int)
  order!: number
}

@ArgsType()
class RemoveIngredientFromProductArgs implements Partial<ProductIngredient> {
  @Field(() => ID)
  productId!: number

  @Field(() => ID)
  ingredientId!: number
}

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

  @FieldResolver(() => Ingredient)
  async ingredient(@Root() productIngredient: ProductIngredient): Promise<Ingredient> {
    return Ingredient.findOneOrFail({ where: { id: productIngredient.ingredientId } })
  }

  @Mutation(() => ProductIngredient)
  addIngredientToProduct(@Args() args: AddIngredientToProductArgs): Promise<ProductIngredient> {
    const productIngredient = ProductIngredient.create(args)
    return productIngredient.save()
  }

  @Mutation(() => ProductIngredient)
  async removeIngredientFromProduct(
    @Args() args: RemoveIngredientFromProductArgs,
  ): Promise<ProductIngredient> {
    const { ingredientId, productId } = args
    const productIngredient = await ProductIngredient.findOneOrFail({
      where: { ingredientId, productId },
    })
    productIngredient.remove()
    return productIngredient
  }
}
