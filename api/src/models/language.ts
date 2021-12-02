import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import ProductTranslation from './productTranslation'
import IngredientTranslation from './ingredientTranslation'
import FaqTranslation from './faqTranslation'
import ConstituentTranslation from './constituentTranslation'

@Entity()
@ObjectType()
export default class Language extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id!: string

  @Field()
  @Column()
  name!: string

  @OneToMany(() => ProductTranslation, (translation) => translation.language)
  productTranslations!: ProductTranslation[]

  @OneToMany(() => IngredientTranslation, (translation) => translation.language)
  ingredientTranslations!: IngredientTranslation[]

  @OneToMany(() => FaqTranslation, (translation) => translation.language)
  faqTranslations!: FaqTranslation[]

  @OneToMany(() => ConstituentTranslation, (translation) => translation.language)
  constituentTranslations!: ConstituentTranslation[]

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
