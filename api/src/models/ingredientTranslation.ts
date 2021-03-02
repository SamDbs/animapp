import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'

import Ingredient from './ingredient'
import Language from './language'

@Entity()
export default class IngredientTranslation extends BaseEntity {
  @PrimaryColumn()
  ingredientId!: number

  @PrimaryColumn()
  languageId!: number

  @Column()
  name!: string

  @Column()
  review!: string

  @Column()
  description!: string

  @OneToMany(() => Ingredient, (ingredient) => ingredient.id)
  @JoinColumn({ name: 'ingredientId' })
  public ingredient!: Ingredient

  @OneToMany(() => Language, (language) => language.id)
  @JoinColumn({ name: 'languageId' })
  public language!: Language
}
