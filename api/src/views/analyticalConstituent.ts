import Language from '../models/language'
import AnalyticalConstituent from '../models/analyticalConstituent'
import ConstituentTranslation from '../models/constituentTranslation'

export function viewAnalyticalConstituentClient(
  analyticalConstituent: AnalyticalConstituent,
  language: Language['id'] | undefined = 'FR',
) {
  const analyticalConstituentClient = {
    id: analyticalConstituent.id,
    name:
      analyticalConstituent.translations.find((t) => t.languageId === language)?.name ??
      'This analytical is not translated yet',
    description:
      analyticalConstituent.translations.find((t) => t.languageId === language)?.description ??
      'This analytical constituent is not translated yet',
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
