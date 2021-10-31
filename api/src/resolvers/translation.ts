import { Args, ArgsType, Field, Mutation, Resolver } from 'type-graphql'

import ConstituentTranslation from '../models/constituentTranslation'
import FaqTranslation from '../models/faqTranslation'
import IngredientTranslation from '../models/ingredientTranslation'
import Language from '../models/language'
import ProductTranslation from '../models/productTranslation'

export enum EntityKind {
  'ingredient' = 'ingredient',
  'product' = 'product',
  'faq' = 'faq',
  'constituent' = 'constituent',
}

@ArgsType()
class UpdateTranslationArgs {
  @Field()
  kind!: EntityKind

  @Field()
  languageId!: string

  @Field()
  entityId!: string

  // FAQ
  @Field({ nullable: true })
  answer?: string
  @Field({ nullable: true })
  question?: string

  // Ingredient
  @Field({ nullable: true })
  review?: string

  // Constituent + Ingredient
  @Field({ nullable: true })
  name?: string

  // Constituent + Ingredient + Products
  @Field({ nullable: true })
  description?: string
}

@Resolver()
export default class TranslationResolver {
  @Mutation(() => String)
  async updateTranslation(@Args() args: UpdateTranslationArgs): Promise<'ok'> {
    const id = Number(args.entityId)
    const { languageId } = args
    await Language.findOneOrFail(languageId)

    if (!id) throw new Error('entity id is broken')

    switch (args.kind) {
      case EntityKind.constituent: {
        const existingTranslation = await ConstituentTranslation.findOne({
          where: { analyticalConstituentId: id, languageId },
        })
        const translation =
          existingTranslation ||
          ConstituentTranslation.create({ analyticalConstituentId: id, languageId })
        if (typeof args.description === 'string') translation.description = args.description
        if (typeof args.name === 'string') translation.name = args.name
        await translation.save()
        return 'ok'
      }
      case EntityKind.faq: {
        const existingTranslation = await FaqTranslation.findOne({
          where: { faqId: id, languageId },
        })
        const translation = existingTranslation || FaqTranslation.create({ faqId: id, languageId })
        if (typeof args.answer === 'string') translation.answer = args.answer
        if (typeof args.question === 'string') translation.question = args.question
        await translation.save()
        return 'ok'
      }
      case EntityKind.product: {
        const existingTranslation = await ProductTranslation.findOne({
          where: { productId: id, languageId },
        })
        const translation =
          existingTranslation || ProductTranslation.create({ productId: id, languageId })
        if (typeof args.description === 'string') translation.description = args.description
        await translation.save()
        return 'ok'
      }
      case EntityKind.ingredient: {
        const existingTranslation = await IngredientTranslation.findOne({
          where: { ingredientId: id, languageId },
        })
        const translation =
          existingTranslation || IngredientTranslation.create({ ingredientId: id, languageId })
        if (typeof args.description === 'string') translation.description = args.description
        if (typeof args.name === 'string') translation.name = args.name
        if (typeof args.review === 'string') translation.review = args.review
        await translation.save()
        return 'ok'
      }
      default:
        throw new Error()
    }
  }
}
