import { Arg, Args, ArgsType, Field, Info, Int, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions } from 'typeorm'

import Brand from '../models/brand'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class CreateBrandArgs implements Partial<Brand> {
  @Field()
  name!: string
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
  brands(): Promise<Brand[]> {
    const options: FindManyOptions<Brand> = { order: { id: 'ASC' } }
    return Brand.find(options)
  }

  @Query(() => Int)
  brandsCount(): Promise<number> {
    const options: FindManyOptions<Brand> = {}
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
}
