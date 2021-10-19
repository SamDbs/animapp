import { Arg, Args, ArgsType, Field, Info, Int, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions } from 'typeorm'

import Language from '../models/language'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

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
  languages(): Promise<Language[]> {
    const options: FindManyOptions<Language> = { order: { id: 'ASC' } }
    return Language.find(options)
  }

  @Query(() => Int)
  languagesCount(): Promise<number> {
    const options: FindManyOptions<Language> = {}
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
