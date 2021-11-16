import {
  Arg,
  Args,
  ArgsType,
  Authorized,
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

import AnalyticalConstituent from '../models/analyticalConstituent'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'
import ConstituentTranslation from '../models/constituentTranslation'

@ArgsType()
class GetConstituentsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string
}
@Resolver(() => AnalyticalConstituent)
export default class AnalyticalConstituentResolver {
  @Query(() => AnalyticalConstituent)
  analyticalConstituent(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<AnalyticalConstituent> {
    return AnalyticalConstituent.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, AnalyticalConstituent),
    })
  }

  @Query(() => [AnalyticalConstituent])
  async analyticalConstituents(@Args() args: GetConstituentsArgs): Promise<AnalyticalConstituent[]> {
    const options: FindManyOptions<AnalyticalConstituent> = { order: { id: 'ASC' } }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms) {
      const analyticalConstituents = await ConstituentTranslation.find({
        select: ['analyticalConstituentId'],
        where: [
          { languageId: 'FR', name: new FindOperator('ilike', `%${args.searchTerms}%`) },
          { languageId: 'FR', description: new FindOperator('ilike', `%${args.searchTerms}%`) },
        ],
      })
      options.where = { id: In(analyticalConstituents.map((x) => x.analyticalConstituentId)) }
    }
    return AnalyticalConstituent.find(options)
  }

  @FieldResolver(() => String, { nullable: true })
  async name(@Root() root: AnalyticalConstituent): Promise<ConstituentTranslation['name']> {
    const faqTranslation = await ConstituentTranslation.findOne({
      where: { analyticalConstituentId: root.id, languageId: 'FR' },
    })
    return faqTranslation?.name ?? '-'
  }

  @FieldResolver(() => String, { nullable: true })
  async description(@Root() root: AnalyticalConstituent): Promise<ConstituentTranslation['description']> {
    const faqTranslation = await ConstituentTranslation.findOne({
      where: { analyticalConstituentId: root.id, languageId: 'FR' },
    })
    return faqTranslation?.description ?? '-'
  }

  @FieldResolver(() => [ConstituentTranslation])
  async translations(@Root() root: AnalyticalConstituent) {
    return (await AnalyticalConstituent.findOneOrFail(root.id, { relations: ['translations'] })).translations
  }

  @Query(() => Int)
  async analyticalConstituentsCount(@Args() args: GetConstituentsArgs) {
    const options: FindManyOptions<AnalyticalConstituent> = { order: { id: 'ASC' } }
    if (args.searchTerms) {
      const analyticalConstituents = await ConstituentTranslation.find({
        select: ['analyticalConstituentId'],
        where: [
          { name: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
          { description: new FindOperator('ilike', `%${args.searchTerms}%`), languageId: 'FR' },
        ],
      })
      options.where = { id: In(analyticalConstituents.map((x) => x.analyticalConstituentId)) }
    }
    return AnalyticalConstituent.count(options)
  }

  @Authorized()
  @Mutation(() => AnalyticalConstituent)
  createConstituent(): Promise<AnalyticalConstituent> {
    const faq = AnalyticalConstituent.create()
    return faq.save()
  }

  @Authorized()
  @Mutation(() => AnalyticalConstituent)
  async deleteConstituent(@Arg('id') id: string): Promise<AnalyticalConstituent> {
    const faq = await AnalyticalConstituent.findOneOrFail(id)
    return faq.softRemove()
  }
}
