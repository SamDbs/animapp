import {
  Arg,
  Args,
  ArgsType,
  Field,
  Info,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator, IsNull, Not } from 'typeorm'

import Brand from '../models/brand'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class CreateBrandArgs implements Partial<Brand> {
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
    if (args.searchTerms)
      options.where = { name: new FindOperator('ilike', `%${args.searchTerms}%`) }
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
    if (args.searchTerms)
      options.where = { name: new FindOperator('ilike', `%${args.searchTerms}%`) }
    return Brand.count(options)
  }

  @Mutation(() => Brand)
  createBrand(@Args() args: CreateBrandArgs): Promise<Brand> {
    const brand = Brand.create(args)
    return brand.save()
  }

  @Mutation(() => Brand)
  async deleteBrand(@Arg('id') id: string): Promise<Brand> {
    const brand = await Brand.findOneOrFail(id)
    return brand.softRemove()
  }

  @Mutation(() => Brand)
  async restoreBrand(@Arg('id') id: string) {
    const brand = await Brand.findOneOrFail(id, { withDeleted: true })
    brand.deletedAt = null
    return brand.save()
  }
}
