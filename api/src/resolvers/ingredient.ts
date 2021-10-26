import {
  Arg,
  Args,
  ArgsType,
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

import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class UpdateIngredientArgs implements Partial<Ingredient> {
  @Field()
  rating?: number
}

@InputType()
class IngredientFilters {
  @Field(() => Boolean)
  deleted?: boolean
}

@ArgsType()
class GetIngredientsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string

  @Field({ nullable: true })
  filters?: IngredientFilters
}

@Resolver(() => Ingredient)
export default class IngredientResolver {
  @Query(() => Ingredient)
  ingredient(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Ingredient> {
    return Ingredient.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Ingredient),
    })
  }

  @Query(() => [Ingredient])
  async ingredients(@Args() args: GetIngredientsArgs): Promise<Ingredient[]> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Ingredient> = {
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms) {
      const ingredientIds = await IngredientTranslation.find({
        select: ['ingredientId'],
        where: [
          { name: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { review: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { description: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
        ],
      })
      console.log('ingre', ingredientIds)
      // Object.assign(options.where, { id: In(ingredientIds.map((x) => x.ingredientId)) })
    }

    return Ingredient.find(options)
  }

  @Query(() => Int)
  async ingredientsCount(@Args() args: GetIngredientsArgs): Promise<number> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Ingredient> = {
      order: { id: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
    if (args.searchTerms) {
      const faqIds = await IngredientTranslation.find({
        select: ['ingredientId'],
        where: [
          { name: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { review: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { description: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
        ],
      })
      options.where = { id: In(faqIds.map((x) => x.ingredientId)) }
    }
    return Ingredient.count(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async name(@Root() ingredient: Ingredient): Promise<IngredientTranslation['name'] | undefined> {
    const ingredientTranslation = await IngredientTranslation.findOne({
      where: { ingredientId: ingredient.id, languageId: 'EN' },
    })
    return ingredientTranslation?.name ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async review(
    @Root() ingredient: Ingredient,
  ): Promise<IngredientTranslation['review'] | undefined> {
    const ingredientTranslation = await IngredientTranslation.findOne({
      where: { ingredientId: ingredient.id, languageId: 'EN' },
    })
    return ingredientTranslation?.review ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async description(
    @Root() ingredient: Ingredient,
  ): Promise<IngredientTranslation['description'] | undefined> {
    const ingredientTranslation = await IngredientTranslation.findOne({
      where: { ingredientId: ingredient.id, languageId: 'EN' },
    })
    return ingredientTranslation?.description ?? '-'
  }

  @Mutation(() => Ingredient)
  createIngredient(): Promise<Ingredient> {
    const ingredient = Ingredient.create()
    return ingredient.save()
  }

  @Mutation(() => Ingredient)
  async updateIngredient(
    @Arg('id') id: string,
    @Args() update: UpdateIngredientArgs,
  ): Promise<Ingredient> {
    if (typeof update.rating === 'number') {
      if (update.rating < 0 || update.rating > 2) {
        throw new Error('Rating must be betwwen 0 or 2.')
      }
    }

    await Ingredient.update(id, update)
    return Ingredient.findOneOrFail(id)
  }

  @Mutation(() => String)
  async deleteIngredient(@Arg('id') id: string) {
    const ingredient = await Ingredient.findOneOrFail(id)
    ingredient.softRemove()
    return id
  }

  @Mutation(() => String)
  async restoreIngredient(@Arg('id') id: string) {
    const ingredient = await Ingredient.findOneOrFail(id, { withDeleted: true })
    ingredient.deletedAt = null
    await ingredient.save()
    return ingredient.id
  }
}
