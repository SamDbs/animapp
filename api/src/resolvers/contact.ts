import { Arg, Args, ArgsType, Field, Info, Int, Mutation, Query, Resolver } from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator } from 'typeorm'

import Contact from '../models/contact'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@ArgsType()
class GetContactsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string
}

@ArgsType()
class GetContactsCountArgs {
  @Field({ nullable: true })
  searchTerms?: string
}

@ArgsType()
class CreateContactArgs implements Partial<Contact> {
  @Field()
  email!: string

  @Field()
  message!: string

  @Field()
  name!: string
}

@Resolver(() => Contact)
export default class ContactResolver {
  @Query(() => Contact)
  contact(@Arg('id') id: string, @Info() info: GraphQLResolveInfo): Promise<Contact> {
    return Contact.findOneOrFail(id, {
      select: getSelectedFieldsFromForModel(info, Contact),
    })
  }

  @Query(() => [Contact])
  contacts(@Args() args: GetContactsArgs): Promise<Contact[]> {
    const options: FindManyOptions<Contact> = { order: { id: 'ASC' } }
    if (args.limit) options.take = args.limit
    if (args.limit && args.offset) options.skip = args.offset
    if (args.searchTerms)
      options.where = [
        { email: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { name: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { message: new FindOperator('ilike', `%${args.searchTerms}%`) },
      ]
    return Contact.find(options)
  }

  @Query(() => Int)
  contactsCount(@Args() args: GetContactsCountArgs): Promise<number> {
    const options: FindManyOptions<Contact> = {}
    if (args.searchTerms)
      options.where = [
        { email: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { name: new FindOperator('ilike', `%${args.searchTerms}%`) },
        { message: new FindOperator('ilike', `%${args.searchTerms}%`) },
      ]
    return Contact.count(options)
  }

  @Mutation(() => Contact)
  createContact(@Args() args: CreateContactArgs): Promise<Contact> {
    const contact = Contact.create(args)
    return contact.save()
  }

  @Mutation(() => Contact)
  async deleteContact(@Arg('id') id: string): Promise<Contact> {
    const contact = await Contact.findOneOrFail(id)
    return contact.softRemove()
  }
}
