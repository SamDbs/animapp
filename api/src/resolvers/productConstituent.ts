import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductConstituent from '../models/productAnalyticalConstituent'
import Constituent from '../models/analyticalConstituent'

@ArgsType()
class AddConstituentToProductArgs implements Partial<ProductConstituent> {
  @Field(() => ID)
  productId!: number

  @Field(() => ID)
  analyticalConstituentId!: number

  @Field({ nullable: true })
  quantity?: string
}

@ArgsType()
class RemoveConstituentFromProductArgs implements Partial<ProductConstituent> {
  @Field(() => ID)
  productId!: number

  @Field(() => ID)
  analyticalConstituentId!: number
}

@Resolver(() => ProductConstituent)
export default class ProductConstituentResolver {
  @Query(() => ProductConstituent)
  productConstituent(
    @Arg('productId') productId: string,
    @Arg('analyticalConstituentId') analyticalConstituentId: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<ProductConstituent> {
    return ProductConstituent.findOneOrFail({
      select: getSelectedFieldsFromForModel(info, ProductConstituent),
      where: { productId, analyticalConstituentId },
    })
  }

  @Query(() => [ProductConstituent])
  productConstituents(@Arg('productId') productId: string): Promise<ProductConstituent[]> {
    return ProductConstituent.find({ where: { productId } })
  }

  @FieldResolver(() => Constituent)
  async constituent(@Root() productConstituent: ProductConstituent): Promise<Constituent> {
    return Constituent.findOneOrFail({ where: { id: productConstituent.analyticalConstituentId } })
  }

  @Mutation(() => ProductConstituent)
  addConstituentToProduct(@Args() args: AddConstituentToProductArgs): Promise<ProductConstituent> {
    const productConstituent = ProductConstituent.create(args)
    return productConstituent.save()
  }

  @Mutation(() => ProductConstituent)
  async removeConstituentFromProduct(
    @Args() args: RemoveConstituentFromProductArgs,
  ): Promise<ProductConstituent> {
    const { analyticalConstituentId, productId } = args
    const productConstituent = await ProductConstituent.findOneOrFail({
      where: { analyticalConstituentId, productId },
    })
    productConstituent.remove()
    return productConstituent
  }
}
