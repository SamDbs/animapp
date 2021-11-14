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

import Language from './language'
import AnalyticalConstituent from './analyticalConstituent'

@Entity()
@ObjectType()
export default class ConstituentTranslation extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  analyticalConstituentId!: number

  @Field(() => ID)
  @PrimaryColumn()
  languageId!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  name!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  description!: string

  @ManyToOne(() => AnalyticalConstituent, (analyticalConstituent) => analyticalConstituent.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'analyticalConstituentId' })
  analyticalConstituent!: AnalyticalConstituent

  @ManyToOne(() => Language, (language) => language.constituentTranslations)
  @JoinColumn({ name: 'languageId' })
  language!: Language

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
