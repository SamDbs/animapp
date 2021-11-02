import {
  Arg,
  Args,
  ArgsType,
  Field,
  Info,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import { GraphQLResolveInfo } from 'graphql'
import { FindManyOptions, FindOperator, IsNull, Not } from 'typeorm'

import Contact from '../models/contact'
import getSelectedFieldsFromForModel from '../utils/grapql-model-fields'

@InputType()
class ContactFilters {
  @Field(() => Boolean)
  deleted?: boolean
}
@ArgsType()
class GetContactsArgs {
  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  offset?: number

  @Field({ nullable: true })
  searchTerms?: string

  @Field({ nullable: true })
  filters?: ContactFilters
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
  async contacts(
    @Args() args: GetContactsArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Contact[]> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Contact> = {
      select: getSelectedFieldsFromForModel(info, Contact),
      order: { createdAt: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
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
  contactsCount(@Args() args: GetContactsArgs): Promise<number> {
    const deletedAt = args.filters?.deleted === true ? Not(IsNull()) : IsNull()
    const options: FindManyOptions<Contact> = {
      order: { createdAt: 'ASC' },
      where: { deletedAt },
      withDeleted: true,
    }
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
  async deleteContact(@Arg('id') id: string) {
    const contact = await Contact.findOneOrFail(id)
    return contact.softRemove()
  }

  @Mutation(() => Contact)
  async restoreContact(@Arg('id') id: string) {
    const contact = await Contact.findOneOrFail(id, { withDeleted: true })
    contact.deletedAt = null
    return contact.save()
  }
}
