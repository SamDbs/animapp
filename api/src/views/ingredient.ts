import Language from '../models/language'
import Ingredient from '../models/ingredient'
import TranslationService from '../services/TranslationService'
import { TranslationEntityType } from '../models/translation'

export async function viewIngredient(ingredient: Ingredient, languageId: Language['id'] = 'EN') {
  const t = new TranslationService()

  const namePromise = t.get(
    `${ingredient.id}-name`,
    languageId,
    TranslationEntityType.INGREDIENT,
    'This ingredient is not translated yet',
  )

  const reviewPromise = t.get(
    `${ingredient.id}-review`,
    languageId,
    TranslationEntityType.INGREDIENT,
    'This ingredient is not translated yet',
  )

  const descriptionPromise = t.get(
    `${ingredient.id}-description`,
    languageId,
    TranslationEntityType.INGREDIENT,
    'This ingredient is not translated yet',
  )

  const ingredientClient = {
    id: ingredient.id,
    image: ingredient.image ?? 'This ingredient does not have a picture yet',
    name: await namePromise,
    review: await reviewPromise,
    description: await descriptionPromise,
    rating: ingredient.rating,
  }
  return ingredientClient
}

export function viewIngredients(ingredients: Ingredient[], languageId: Language['id'] = 'EN') {
  return ingredients.map((ingredient) => viewIngredient(ingredient, languageId))
}
