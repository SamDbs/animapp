import { BaseEntity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Field, ID } from 'type-graphql'

import Language from './language'

export enum TranslationEntityType {
  PRODUCT = 'PRODUCT',
  INGREDIENT = 'INGREDIENT',
  CONSTITUENT = 'CONSTITUENT',
  FAQ = 'FAQ',
}

export default class Translation extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  key!: string

  @Field(() => String)
  @PrimaryColumn()
  languageId!: Language['id']

  @Field()
  @Column({ type: 'enum', enum: TranslationEntityType })
  entityType!: TranslationEntityType

  @Field()
  @Column()
  content!: string

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  language!: Language
}
