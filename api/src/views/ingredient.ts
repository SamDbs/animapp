import Language from '../models/language'
import Ingredient from '../models/ingredient'

export function viewIngredient(ingredient: Ingredient, language: Language['id'] = 'FR') {
  let ingredientTranslation = ingredient.translations.find((t) => t.languageId === language)

  if (!ingredientTranslation)
    ingredientTranslation = ingredient.translations.find((t) => t.languageId === 'FR')

  const ingredientClient = {
    id: ingredient.id,
    name: ingredientTranslation?.name ?? 'This ingredient is not translated yet',
    review: ingredientTranslation?.review ?? 'This ingredient is not translated yet',
    description: ingredientTranslation?.description ?? 'This ingredient is not translated yet',
  }
  return ingredientClient
}

export function viewIngredientWithTranslations(ingredient: Ingredient) {
  const ingredientTranslations = ingredient.translations

  const ingredientClient = {
    id: ingredient.id,
    translations: ingredientTranslations,
  }
  return ingredientClient
}

export function viewIngredients(ingredients: Ingredient[], language: Language['id'] = 'FR') {
  return ingredients.map((ingredient) => viewIngredient(ingredient, language))
}
