import { ObjectType } from 'type-graphql'
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

import Ingredient from './ingredient'
import Language from './language'

@Entity()
@ObjectType()
export default class IngredientTranslation extends BaseEntity {
  @PrimaryColumn()
  ingredientId!: number

  @PrimaryColumn()
  languageId!: string

  @Column()
  name!: string

  @Column()
  review!: string

  @Column()
  description!: string

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient

  @ManyToOne(() => Language, (language) => language.ingredientTranslations)
  @JoinColumn({ name: 'languageId' })
  language!: Language

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
