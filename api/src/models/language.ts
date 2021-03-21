import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import ProductTranslation from './productTranslation'
import IngredientTranslation from './ingredientTranslation'

@Entity()
export default class Language extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @OneToMany(() => ProductTranslation, (translation) => translation.language)
  productTranslations!: ProductTranslation[]

  @OneToMany(() => IngredientTranslation, (translation) => translation.language)
  ingredientTranslations!: IngredientTranslation[]
}