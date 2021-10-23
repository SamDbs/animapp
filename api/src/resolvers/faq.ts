import { Arg, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'

import Faq from '../models/faq'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import FaqTranslation from '../models/faqTranslation'

@Resolver(() => Faq)
export default class FaqResolver {
  @Query(() => Faq)
  faq(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Faq> {
    return Faq.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Faq),
    })
  }

  @Query(() => [Faq])
  faqs(): Promise<Faq[]> {
    return Faq.find()
  }

  @FieldResolver(() => String, { nullable: true })
  async question(@Root() faq: Faq): Promise<FaqTranslation['question'] | undefined> {
    const faqTranslation = await FaqTranslation.findOne({
      where: { faqId: faq.id, languageId: 'EN' },
    })
    return faqTranslation?.question
  }

  @FieldResolver(() => String, { nullable: true })
  async answer(@Root() faq: Faq): Promise<FaqTranslation['answer'] | undefined> {
    const faqTranslation = await FaqTranslation.findOne({
      where: { faqId: faq.id, languageId: 'EN' },
    })
    return faqTranslation?.answer
  }

  @Mutation(() => Faq)
  createFaq(): Promise<Faq> {
    const faq = Faq.create()
    return faq.save()
  }

  @Mutation(() => Faq)
  async deleteFaq(@Arg('id') id: string): Promise<Faq> {
    const faq = await Faq.findOneOrFail(id)
    return faq.softRemove()
  }
}
