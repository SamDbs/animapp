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
  public ingredient!: Ingredient

  @ManyToOne(() => Language, (language) => language.ingredientTranslations)
  @JoinColumn({ name: 'languageId' })
  public language!: Language

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deteded_at' })
  deletedAt!: Date
}
