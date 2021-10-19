import { Arg, Args, ArgsType, Field, Info, Int, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator } from 'typeorm'

import Language from '../models/language'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class GetLanguagesArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string
}

@ArgsType()
class GetLanguagesCountArgs {
  @Field({ nullable: true })
  searchTerms?: string
}

@ArgsType()
class CreateLanguageArgs implements Partial<Language> {
  @Field()
  name!: string

  @Field()
  id!: string
}

@Resolver(() => Language)
export default class LanguageResolver {
  @Query(() => Language)
  language(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Language> {
    return Language.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Language),
    })
  }

  @Query(() => [Language])
  languages(@Args() args: GetLanguagesArgs): Promise<Language[]> {
    const options: FindManyOptions<Language> = { order: { id: 'ASC' } }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms)
      options.where = [
        { id: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { name: new FindOperator('ilike', `%${args.searchTerms}%`) },
      ]
    return Language.find(options)
  }

  @Query(() => Int)
  languagesCount(@Args() args: GetLanguagesCountArgs): Promise<number> {
    const options: FindManyOptions<Language> = {}
    if (args.searchTerms)
      options.where = [
        { id: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { name: new FindOperator('ilike', `%${args.searchTerms}%`) },
      ]
    return Language.count(options)
  }

  @Mutation(() => Language)
  createLanguage(@Args() args: CreateLanguageArgs): Promise<Language> {
    const language = Language.create(args)
    return language.save()
  }

  @Mutation(() => Language)
  async deleteLanguage(@Arg('id') id: string): Promise<Language> {
    const language = await Language.findOneOrFail(id)
    return language.softRemove()
  }
}
