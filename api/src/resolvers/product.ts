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
import { FindManyOptions, FindOperator, In, IsNull, Not } from 'typeorm'

import Product, { ProductType } from '../models/product'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductIngredient from '../models/productIngredients'
import Image from '../models/image'
import ProductTranslation from '../models/productTranslation'
import removeUndefineds from '../utils/remove-undefined-fields'
import Brand from '../models/brand'

@InputType()
class ProductsFilters {
  @Field(() => Boolean, { nullable: true })
  deleted?: boolean

  @Field(() => Boolean, { nullable: true })
  published?: boolean
}

@ArgsType()
class CreateProductArgs implements Partial<Product> {
  @Field()
  barCode!: string

  @Field(() => String)
  brandId!: number

  @Field()
  name!: string

  @Field({ nullable: true })
  type?: ProductType
}

@ArgsType()
class GetProductsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string

  @Field({ nullable: true })
  filters?: ProductsFilters
}

@ArgsType()
class UpdateProductArgs {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  barCode?: string

  @Field({ nullable: true })
  type?: ProductType

  @Field({ nullable: true })
  published?: boolean

  @Field({ nullable: true })
  brandId?: string
}

@Resolver(() => Product)
export default class ProductResolver {
  @Query(() => Product)
  product(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Product> {
    return Product.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Product),
    })
  }

  @Query(() => [Product])
  async products(@Args() args: GetProductsArgs, @Info() info: GraphQLResolveInfo): Promise<Product[]> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Product> = {
      select: getSelectedFieldsFromForModel(info, Product),
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.filters?.published !== undefined) Object.assign(options.where, { published: args.filters.published })
    if (args.searchTerms) {
      const productIds = await ProductTranslation.find({
        select: ['productId'],
        where: {
          description: new FindOperator('ilike', `%${args.searchTerms}%`),
          languageId: 'EN',
        },
      })
      Object.assign(options.where, { id: In(productIds.map((x) => x.productId)) })
    }

    return Product.find(options)
  }

  @Query(() => Int)
  async productsCount(@Args() args: GetProductsArgs): Promise<number> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Product> = {
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.filters?.published !== undefined) Object.assign(options.where, { published: args.filters.published })
    if (args.searchTerms) {
      const productIds = await ProductTranslation.find({
        select: ['productId'],
        where: {
          description: new FindOperator('ilike', `%${args.searchTerms}%`),
          languageId: 'EN',
        },
      })
      Object.assign(options.where, { id: In(productIds.map((x) => x.productId)) })
    }

    return Product.count(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async description(@Root() product: Product): Promise<ProductTranslation['description'] | undefined> {
    const productTranslation = await ProductTranslation.findOne({
      where: { productId: product.id, languageId: 'EN' },
    })
    return productTranslation?.description ?? '-'
  }

  @FieldResolver()
  ingredients(@Root() product: Product): Promise<ProductIngredient[]> {
    return ProductIngredient.find({ where: { productId: product.id } })
  }

  @FieldResolver(() => Brand)
  async brand(@Root() product: Product) {
    const productTranslation = await Product.findOneOrFail(product.id, {
      relations: ['brand'],
    })
    return productTranslation.brand
  }

  @FieldResolver(() => String, { nullable: true })
  async image(@Root() product: Product): Promise<string | undefined> {
    const image = await Image.findOne({ select: ['url'], where: { productId: product.id } })

    return image?.url ?? 'https://via.placeholder.com/400'
  }

  @FieldResolver(() => [ProductTranslation])
  async translations(@Root() product: Product) {
    const productTranslation = await Product.findOneOrFail(product.id, {
      relations: ['translations'],
    })
    return productTranslation.translations
  }

  @Authorized()
  @Mutation(() => Product)
  async updateProduct(@Arg('id') id: string, @Args() args: UpdateProductArgs) {
    await Product.update(id, removeUndefineds(args))
    return Product.findOneOrFail(id)
  }

  @Authorized()
  @Mutation(() => Product)
  async createProduct(@Args() args: CreateProductArgs) {
    const product = Product.create(args)
    return product.save()
  }
}
