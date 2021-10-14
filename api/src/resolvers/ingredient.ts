import { Arg, Info, Query, Resolver } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import Ingredient from '../models/ingredient'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

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
}
