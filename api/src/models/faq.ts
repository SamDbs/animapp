import { ObjectType } from 'type-graphql'
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
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => FaqTranslation, (translation) => translation.faq)
  translations!: FaqTranslation[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
