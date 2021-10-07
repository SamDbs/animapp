import { ObjectType } from 'type-graphql'
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
  @PrimaryColumn()
  id!: string

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

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
