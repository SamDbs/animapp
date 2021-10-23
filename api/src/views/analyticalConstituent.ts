import Language from '../models/language'
import AnalyticalConstituent from '../models/analyticalConstituent'
import ConstituentTranslation from '../models/constituentTranslation'
import TranslationService from '../services/TranslationService'
import { TranslationEntityType } from '../models/translation'

export async function viewAnalyticalConstituentClient(
  analyticalConstituent: AnalyticalConstituent,
  languageId: Language['id'] = 'EN',
) {
  const t = new TranslationService()
  const namePromise = t.get(
    `${analyticalConstituent.id}-name`,
    languageId,
    TranslationEntityType.CONSTITUENT,
    'This name constituent is not translated yet',
  )

  const descriptionPromise = t.get(
    `${analyticalConstituent.id}-description`,
    languageId,
    TranslationEntityType.CONSTITUENT,
    'This description constituent is not translated yet',
  )
  const analyticalConstituentClient = {
    id: analyticalConstituent.id,
    name: await namePromise,
    description: await descriptionPromise,
  }
  return analyticalConstituentClient
}

export function viewAnalyticalConstituentsClient(
  analyticalConstituents: AnalyticalConstituent[],
  languageId: Language['id'] | undefined = 'EN',
) {
  return analyticalConstituents.map((analyticalConstituent) =>
    viewAnalyticalConstituentClient(analyticalConstituent, languageId),
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
