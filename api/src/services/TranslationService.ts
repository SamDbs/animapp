import NodeCache from 'node-cache'

import Language from '../models/language'
import Translation, { TranslationEntityType } from '../models/translation'

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 })

interface ITranslationService {
  get(key: string, languageId: string, entity: TranslationEntityType): Promise<string>
}

export default class TranslationService implements ITranslationService {
  async get(
    key: string,
    languageId: Language['id'],
    entityType: TranslationEntityType,
    defaultValue = '',
  ): Promise<string> {
    const cacheKey = `${languageId}-${entityType}-${key}`

    const translationContent = cache.get<string>(cacheKey)

    if (!translationContent) {
      const translation = await Translation.findOne({ where: { key, entityType } })
      if (translation) cache.set(cacheKey, translation.content)
      else cache.set(cacheKey, defaultValue)
    }

    return translationContent ?? defaultValue
  }
}
