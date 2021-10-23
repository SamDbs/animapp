import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import Faq from './faq'
import Language from './language'

@Entity()
@ObjectType()
export default class FaqTranslation extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  faqId!: number

  @Field(() => ID)
  @PrimaryColumn()
  languageId!: string

  @Field()
  @Column()
  question!: string

  @Field()
  @Column()
  answer!: string

  @ManyToOne(() => Faq, (faq) => faq.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faqId' })
  faq!: Faq

  @ManyToOne(() => Language, (language) => language.faqTranslations)
  @JoinColumn({ name: 'languageId' })
  language!: Language

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
