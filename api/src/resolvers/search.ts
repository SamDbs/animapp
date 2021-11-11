import { Arg, Field, ObjectType, Query, Resolver } from 'type-graphql'

import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'
import parseQueryToWordArray from '../services/parseQueryToWords'

@ObjectType()
class SearchIngredient {
  @Field({ nullable: true })
  ingredientSearched!: string
  @Field(() => Ingredient, { nullable: true })
  ingredientFound?: Ingredient | null
}

@Resolver(() => SearchIngredient)
export default class SearchResolver {
  @Query(() => [SearchIngredient])
  async analyzeIngredients(@Arg('q') q: string): Promise<SearchIngredient[]> {
    const words = parseQueryToWordArray(q)
    const searchResult = await Promise.all(
      words.map(async (word) => {
        const ingredient = await IngredientTranslation.createQueryBuilder('t')
          .innerJoinAndSelect('t.ingredient', 'ingredient')
          .leftJoinAndSelect('ingredient.translations', 'ts')
          .where('t.name ILike :q', { q: `%${word}%` })
          .getOne()
        return {
          ingredientSearched: word,
          ingredientFound: ingredient ? ingredient.ingredient : null,
        }
      }),
    )
    console.log('search result', searchResult)
    return searchResult
  }
}
