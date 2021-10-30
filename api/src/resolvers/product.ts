import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import Product, { ProductType } from '../models/product'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ProductIngredient from '../models/productIngredients'
import Image from '../models/image'
import ProductTranslation from '../models/productTranslation'
import removeUndefineds from '../utils/remove-undefined-fields'

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
  products(@Info() info: GraphQLResolveInfo): Promise<Product[]> {
    return Product.find({
      cache: false,
      select: getSelectedFieldsFromForModel(info, Product),
    })
  }

  @FieldResolver()
  ingredients(@Root() product: Product): Promise<ProductIngredient[]> {
    return ProductIngredient.find({ where: { productId: product.id } })
  }

  @FieldResolver(() => String, { nullable: true })
  async image(@Root() product: Product): Promise<string | undefined> {
    const image = await Image.findOne({ select: ['url'], where: { productId: product.id } })

    return image?.url ?? 'https://via.placeholder.com/400'
  }

  @FieldResolver(() => [ProductTranslation])
  async translations(@Root() root: Product) {
    const productTranslation = await Product.findOneOrFail(root.id, { relations: ['translations'] })
    return productTranslation.translations
  }

  @Mutation(() => Product)
  async updateProduct(@Arg('id') id: string, @Args() args: UpdateProductArgs) {
    await Product.update(id, removeUndefineds(args))
    return Product.findOneOrFail(id)
  }
}
