import Language from '../models/language'
import AnalyticalConstituent from '../models/analyticalConstituent'
import ConstituentTranslation from '../models/constituentTranslation'

export function viewAnalyticalConstituentClient(
  analyticalConstituent: AnalyticalConstituent,
  language: Language['id'] | undefined = 'FR',
) {
  let translation = analyticalConstituent.translations.find((t) => t.languageId === language)

  if (!translation)
    translation = analyticalConstituent.translations.find((t) => t.languageId === 'FR')

  const analyticalConstituentClient = {
    id: analyticalConstituent.id,
    name: translation?.name ?? 'This analytical is not translated yet',
    description: translation?.description ?? 'This analytical constituent is not translated yet',
  }
  return analyticalConstituentClient
}

export function viewAnalyticalConstituentsClient(
  analyticalConstituents: AnalyticalConstituent[],
  language: Language['id'] | undefined = 'FR',
) {
  return analyticalConstituents.map((analyticalConstituent) =>
    viewAnalyticalConstituentClient(analyticalConstituent, language),
  )
}

export function viewAnalyticalConstituentWithTranslations(
  constituentTranslations: ConstituentTranslation[],
) {
  return constituentTranslations
}

export function viewAnalyticalTranslation(constituentTranslation: ConstituentTranslation) {
  return constituentTranslation
}
