import {
  Arg,
  Args,
  ArgsType,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Info,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { uniqBy } from 'lodash/fp'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator, In, IsNull, Not } from 'typeorm'

import Product, { ProductType } from '../models/product'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductAnalyticalConstituent from '../models/productAnalyticalConstituent'
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
class GetProductArgs {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  barCode?: string

  @Field({ nullable: true })
  filters?: ProductsFilters
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
  product(@Args() args: GetProductArgs, @Info() info: GraphQLResolveInfo): Promise<Product> {
    const { barCode, filters, id } = args

    if (!id && !barCode) throw new Error('A product can only be found using id or barCode')

    const where: FindManyOptions<Product>['where'] = {}
    if (id) where.id = id
    if (barCode) where.barCode = barCode
    if (filters?.published !== undefined) where.published = filters.published

    return Product.findOneOrFail({
      select: getSelectedFieldsFromForModel(info, Product),
      where,
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
      const productWhere = Object.assign(options.where, { name: args.searchTerms })
      const queryProduct = Product.find({
        select: getSelectedFieldsFromForModel(info, Product),
        where: productWhere,
        withDeleted: true,
      })

      const queryBrandProducts = Brand.createQueryBuilder('b')
        .select(['b.id', 'p.id'])
        .withDeleted()
        .where('b.name ilike :q', { q: `%${args.searchTerms}%` })
      if (args.filters?.published !== undefined) {
        queryBrandProducts.andWhere('p.published = :published', {
          published: args.filters.published,
        })
      }
      queryBrandProducts.innerJoin('b.products', 'p')

      const querySimilarProducts = Product.createQueryBuilder('p')
        .select('p.id')
        .withDeleted()
        .where('p.name ilike :q', { q: `%${args.searchTerms}%` })

      if (args.filters?.published !== undefined) {
        querySimilarProducts.andWhere('p.published = :published', {
          published: args.filters.published,
        })
      }

      const querySimilarProductsTranslations = ProductTranslation.find({
        select: ['productId'],
        where: {
          description: new FindOperator('ilike', `%${args.searchTerms}%`),
          languageId: 'FR',
        },
        withDeleted: true,
      })
      const [product, brand, similarProducts, productTranslations] = await Promise.all([
        queryProduct,
        queryBrandProducts.getOne(),
        querySimilarProducts.getMany(),
        querySimilarProductsTranslations,
      ])

      const brandProductIds = brand?.products.map((p) => p.id) ?? []
      const similarProductIds = similarProducts.map((p) => p.id)
      const productTranslationProductIds = productTranslations.map((x) => x.productId)

      const [p1, p2, p3] = await Promise.all([
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(brandProductIds) },
          withDeleted: true,
        }),
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(similarProductIds) },
          withDeleted: true,
        }),
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(productTranslationProductIds) },
          withDeleted: true,
        }),
      ])
      return uniqBy('id', [...product, ...p1, ...p2, ...p3])
    }

    return Product.find(options)
  }

  @Query(() => Int)
  async productsCount(@Args() args: GetProductsArgs, @Info() info: GraphQLResolveInfo): Promise<number> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Product> = {
      select: ['id'],
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.filters?.published !== undefined) Object.assign(options.where, { published: args.filters.published })
    if (args.searchTerms) {
      const productWhere = Object.assign(options.where, { name: args.searchTerms })
      const queryProduct = Product.find({
        select: ['id'],
        where: productWhere,
        withDeleted: true,
      })

      const queryBrandProducts = Brand.createQueryBuilder('b')
        .select(['b.id', 'p.id'])
        .withDeleted()
        .where('b.name ilike :q', { q: `%${args.searchTerms}%` })
      if (args.filters?.published !== undefined) {
        queryBrandProducts.andWhere('p.published = :published', {
          published: args.filters.published,
        })
      }
      queryBrandProducts.innerJoin('b.products', 'p')

      const querySimilarProducts = Product.createQueryBuilder('p')
        .select('p.id')
        .withDeleted()
        .where('p.name ilike :q', { q: `%${args.searchTerms}%` })

      if (args.filters?.published !== undefined) {
        querySimilarProducts.andWhere('p.published = :published', {
          published: args.filters.published,
        })
      }

      const querySimilarProductsTranslations = ProductTranslation.find({
        select: ['productId'],
        where: {
          description: new FindOperator('ilike', `%${args.searchTerms}%`),
          languageId: 'FR',
        },
        withDeleted: true,
      })
      const [product, brand, similarProducts, productTranslations] = await Promise.all([
        queryProduct,
        queryBrandProducts.getOne(),
        querySimilarProducts.getMany(),
        querySimilarProductsTranslations,
      ])

      const brandProductIds = brand?.products.map((p) => p.id) ?? []
      const similarProductIds = similarProducts.map((p) => p.id)
      const productTranslationProductIds = productTranslations.map((x) => x.productId)

      const [p1, p2, p3] = await Promise.all([
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(brandProductIds) },
          withDeleted: true,
        }),
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(similarProductIds) },
          withDeleted: true,
        }),
        Product.find({
          ...options,
          where: { published: args.filters?.published, id: In(productTranslationProductIds) },
          withDeleted: true,
        }),
      ])
      return uniqBy('id', [...product, ...p1, ...p2, ...p3]).length
    }

    return Product.count(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async description(@Root() product: Product): Promise<ProductTranslation['description'] | undefined> {
    const productTranslation =
      product?.translations?.find((t) => t.languageId === 'FR') ??
      (await ProductTranslation.findOne({
        where: { productId: product.id, languageId: 'FR' },
      }))

    if (productTranslation?.description) return productTranslation.description

    const productTranslationEn =
      product?.translations?.find((t) => t.languageId === 'EN') ??
      (await ProductTranslation.findOne({
        where: { productId: product.id, languageId: 'EN' },
      }))
    return productTranslationEn?.description ?? '-'
  }

  @FieldResolver(() => [ProductIngredient])
  ingredients(@Root() product: Product): Promise<ProductIngredient[]> {
    return ProductIngredient.find({ where: { productId: product.id } })
  }

  @FieldResolver(() => [ProductAnalyticalConstituent])
  constituents(@Root() product: Product): Promise<ProductAnalyticalConstituent[]> {
    return ProductAnalyticalConstituent.find({ where: { productId: product.id } })
  }

  @FieldResolver(() => Brand)
  async brand(@Root() product: Product) {
    const productTranslation = await Product.findOneOrFail(product.id, {
      relations: ['brand'],
    })
    return productTranslation.brand
  }

  @FieldResolver(() => String, { nullable: true })
  async image(@Root() product: Product, @Ctx() ctx: any): Promise<string | undefined> {
    const img = await Image.findOne({ select: ['id'], where: { productId: product.id } })

    if (!img) return undefined

    return `${ctx.restUrl}/products/${product.id}/image`
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
