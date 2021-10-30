import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { FindManyOptions, FindOperator, In } from 'typeorm'
import { GraphQLResolveInfo } from 'graphql'

import Faq from '../models/faq'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import FaqTranslation from '../models/faqTranslation'

@ArgsType()
class GetFAQsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string
}
@Resolver(() => Faq)
export default class FaqResolver {
  @Query(() => Faq)
  faq(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Faq> {
    return Faq.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Faq),
    })
  }

  @Query(() => [Faq])
  async faqs(@Args() args: GetFAQsArgs, @Info() info: GraphQLResolveInfo): Promise<Faq[]> {
    const options: FindManyOptions<Faq> = {
      select: getSelectedFieldsFromForModel(info, Faq),
      order: { id: 'ASC' },
    }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms) {
      const faqIds = await FaqTranslation.find({
        select: ['faqId'],
        where: [
          { question: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { answer: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
        ],
      })
      options.where = { id: In(faqIds.map((x) => x.faqId)) }
    }
    return Faq.find(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async question(@Root() root: Faq): Promise<FaqTranslation['question']> {
    const faqTranslation = await FaqTranslation.findOne({
      where: { faqId: root.id, languageId: 'EN' },
    })
    return faqTranslation?.question ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async answer(@Root() root: Faq): Promise<FaqTranslation['answer']> {
    const faqTranslation = await FaqTranslation.findOne({
      where: { faqId: root.id, languageId: 'EN' },
    })
    return faqTranslation?.answer ?? '-'
  }

  @FieldResolver(() => [FaqTranslation])
  async translations(@Root() root: Faq) {
    return (await Faq.findOneOrFail(root.id, { relations: ['translations'] })).translations
  }

  @Query(() => Int)
  async faqsCount(@Args() args: GetFAQsArgs) {
    const options: FindManyOptions<Faq> = { order: { id: 'ASC' } }
    if (args.searchTerms) {
      const faqIds = await FaqTranslation.find({
        select: ['faqId'],
        where: [
          { question: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
          { answer: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'EN' },
        ],
      })
      options.where = { id: In(faqIds.map((x) => x.faqId)) }
    }
    return Faq.count(options)
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
