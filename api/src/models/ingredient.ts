import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import IngredientTranslation from './ingredientTranslation'

@Entity()
export default class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => IngredientTranslation, (translation) => translation.ingredient)
  translations!: IngredientTranslation[]
}
