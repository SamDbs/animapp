import Language from '../models/language'
import Ingredient from '../models/ingredient'
import IngredientTranslation from '../models/ingredientTranslation'

export function viewIngredient(ingredient: Ingredient, language: Language['id'] = 'EN') {
  let ingredientTranslation = ingredient.translations.find((t) => t.languageId === language)

  if (!ingredientTranslation) ingredientTranslation = ingredient.translations.find((t) => t.languageId === 'EN')

  const ingredientClient = {
    id: ingredient.id,
    image: ingredient.image ?? 'This ingredient does not have a picture yet',
    name: ingredientTranslation?.name ?? 'This ingredient is not translated yet',
    review: ingredientTranslation?.review ?? 'This ingredient is not translated yet',
    description: ingredientTranslation?.description ?? 'This ingredient is not translated yet',
    rating: ingredient.rating,
  }
  return ingredientClient
}

export function viewIngredientTranslations(ingredientTranslations: IngredientTranslation[]) {
  return ingredientTranslations
}

export function viewIngredients(ingredients: Ingredient[], language: Language['id'] = 'EN') {
  return ingredients.map((ingredient) => viewIngredient(ingredient, language))
}

export function viewIngredientTranslation(ingredientTranslation: IngredientTranslation) {
  return ingredientTranslation
}
