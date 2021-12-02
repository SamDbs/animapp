import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import FaqTranslation from './faqTranslation'

@Entity()
@ObjectType()
export default class Faq extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => FaqTranslation, (translation) => translation.faq)
  translations!: FaqTranslation[]

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @Field()
  @DeleteDateColumn()
  deletedAt!: Date
}
