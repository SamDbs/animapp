import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import Product from './product'
import IngredientTranslation from './ingredientTranslation'

@Entity()
export default class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  photo!: string

  @OneToMany(() => IngredientTranslation, (translation) => translation.ingredient)
  translations!: IngredientTranslation[]

  @ManyToMany(() => Product, (product) => product.ingredients)
  products!: Product[]
}
