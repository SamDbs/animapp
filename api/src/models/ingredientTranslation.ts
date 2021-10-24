import { Field, ObjectType } from 'type-graphql'
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  name!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  review!: string

  @Field({ nullable: true })
  @Column({ nullable: true })
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
