import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Field,
  FieldResolver,
  Info,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator, IsNull, Not } from 'typeorm'

import Product from '../models/product'
import Brand from '../models/brand'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import removeUndefineds from '../utils/remove-undefined-fields'

@ArgsType()
class CreateBrandArgs implements Partial<Brand> {
  @Field()
  name!: string
}

@ArgsType()
class UpdateBrandArgs implements Partial<Brand> {
  @Field()
  name!: string
}

@InputType()
class BrandFilters {
  @Field(() => Boolean)
  deleted?: boolean
}

@ArgsType()
class GetBrandsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string

  @Field({ nullable: true })
  filters?: BrandFilters
}

@Resolver(() => Brand)
export default class BrandResolver {
  @Query(() => Brand)
  brand(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Brand> {
    return Brand.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Brand),
    })
  }

  @Query(() => [Brand])
  brands(@Args() args: GetBrandsArgs, @Info() info: GraphQLResolveInfo): Promise<Brand[]> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Brand> = {
      select: getSelectedFieldsFromForModel(info, Brand),
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms) options.where = { name: new FindOperator('ilike', `%${args.searchTerms}%`) }
    return Brand.find(options)
  }

  @Query(() => Int)
  brandsCount(@Args() args: GetBrandsArgs): Promise<number> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Brand> = {
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.searchTerms) options.where = { name: new FindOperator('ilike', `%${args.searchTerms}%`) }
    return Brand.count(options)
  }

  @Authorized()
  @Mutation(() => Brand)
  createBrand(@Args() args: CreateBrandArgs): Promise<Brand> {
    const brand = Brand.create(args)
    return brand.save()
  }

  @Authorized()
  @Mutation(() => Brand)
  async updateBrand(@Arg('id') id: string, @Args() args: UpdateBrandArgs) {
    await Brand.update(id, removeUndefineds(args))
    return Brand.findOneOrFail(id)
  }

  @Authorized()
  @Mutation(() => Brand)
  async deleteBrand(@Arg('id') id: string): Promise<Brand> {
    const brand = await Brand.findOneOrFail(id)
    return brand.softRemove()
  }

  @Authorized()
  @Mutation(() => Brand)
  async restoreBrand(@Arg('id') id: string) {
    const brand = await Brand.findOneOrFail(id, { withDeleted: true })
    brand.deletedAt = null
    return brand.save()
  }

  @Authorized()
  @FieldResolver(() => [Product])
  async products(@Root() brand: Brand) {
    const brandProducts = await Product.find({
      where: { brandId: brand.id },
    })
    return brandProducts
  }
}
