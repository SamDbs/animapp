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

import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class UpdateIngredientArgs implements Partial<Ingredient> {
  @Field()
  rating?: number
}

@Resolver(() => Ingredient)
export default class IngredientResolver {
  @Query(() => Ingredient)
  ingredient(
    @Arg('id') id: string,
    @Info() info: GraphQLResolveInfo,
  ): ReturnType<typeof Ingredient['findOne']> {
    return Ingredient.findOne(id, {
      select: getSelectedFieldsFromForModel(info, Ingredient),
    })
  }

  @Query(() => [Ingredient])
  ingredients(): ReturnType<typeof Ingredient['find']> {
    return Ingredient.find()
  }

  @FieldResolver(() => String, { nullable: true })
  async name(@Root() ingredient: Ingredient): Promise<IngredientTranslation['name'] | undefined> {
    const ingredientTranslation = await IngredientTranslation.findOne({
      where: { ingredientId: ingredient.id, languageId: 'EN' },
    })
    return ingredientTranslation?.name
  }

  @Mutation(() => Ingredient)
  createIngredient(): Promise<Ingredient> {
    const ingredient = Ingredient.create()
    return ingredient.save()
  }

  @Mutation(() => Ingredient)
  async updateIngredient(
    @Arg('id') id: number,
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
}
