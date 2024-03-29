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

import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class UpdateIngredientArgs implements Partial<Ingredient> {
  @Field(() => Int, { nullable: true })
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
    return Ingredient.findOneOrFail(id, { select: getSelectedFieldsFromForModel(info, Ingredient) })
  }

  @Query(() => [Ingredient])
  async ingredients(@Args() args: GetIngredientsArgs, @Info() info: GraphQLResolveInfo): Promise<Ingredient[]> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Ingredient> = {
      select: getSelectedFieldsFromForModel(info, Ingredient),
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
          { name: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
          { review: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
          { description: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
        ],
      })
      Object.assign(options.where, { id: In(ingredientIds.map((x) => x.ingredientId)) })
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
      const ingredientIds = await IngredientTranslation.find({
        select: ['ingredientId'],
        where: [
          { name: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
          { review: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
          { description: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
        ],
      })
      Object.assign(options.where, { id: In(ingredientIds.map((x) => x.ingredientId)) })
    }

    return Ingredient.count(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async name(@Root() ingredient: Ingredient): Promise<IngredientTranslation['name'] | undefined> {
    const ingredientTranslation =
      ingredient?.translations?.find((t) => t.languageId === 'FR') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'FR' },
      }))

    if (ingredientTranslation?.name) return ingredientTranslation.name

    const ingredientTranslationEn =
      ingredient?.translations?.find((t) => t.languageId === 'EN') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'EN' },
      }))
    return ingredientTranslationEn?.name ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async review(@Root() ingredient: Ingredient): Promise<IngredientTranslation['review'] | undefined> {
    const ingredientTranslation =
      ingredient?.translations?.find((t) => t.languageId === 'FR') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'FR' },
      }))
    if (ingredientTranslation?.review) return ingredientTranslation.review

    const ingredientTranslationEn =
      ingredient?.translations?.find((t) => t.languageId === 'EN') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'EN' },
      }))
    return ingredientTranslationEn?.review ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async description(@Root() ingredient: Ingredient): Promise<IngredientTranslation['description'] | undefined> {
    const ingredientTranslation =
      ingredient?.translations?.find((t) => t.languageId === 'FR') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'FR' },
      }))

    if (ingredientTranslation?.description) return ingredientTranslation.description

    const ingredientTranslationEn =
      ingredient?.translations?.find((t) => t.languageId === 'EN') ??
      (await IngredientTranslation.findOne({
        where: { ingredientId: ingredient.id, languageId: 'EN' },
      }))
    return ingredientTranslationEn?.description ?? '-'
  }

  @FieldResolver(() => [IngredientTranslation])
  async translations(@Root() root: Ingredient) {
    return (await Ingredient.findOneOrFail(root.id, { relations: ['translations'] })).translations
  }

  @Authorized()
  @Mutation(() => Ingredient)
  createIngredient(): Promise<Ingredient> {
    const ingredient = Ingredient.create()
    return ingredient.save()
  }

  @Authorized()
  @Mutation(() => Ingredient)
  async updateIngredient(@Arg('id') id: string, @Args() update: UpdateIngredientArgs): Promise<Ingredient> {
    if (typeof update.rating === 'number') {
      if (update.rating < 0 || update.rating > 2) {
        throw new Error('Rating must be betwwen 0 or 2.')
      }
    }

    await Ingredient.update(id, update)
    return Ingredient.findOneOrFail(id)
  }

  @Authorized()
  @Mutation(() => Ingredient)
  async deleteIngredient(@Arg('id') id: string) {
    const ingredient = await Ingredient.findOneOrFail(id)
    ingredient.softRemove()
    return ingredient
  }

  @Authorized()
  @Mutation(() => Ingredient)
  async restoreIngredient(@Arg('id') id: string) {
    const ingredient = await Ingredient.findOneOrFail(id, { withDeleted: true })
    ingredient.deletedAt = null
    return ingredient.save()
  }
}
