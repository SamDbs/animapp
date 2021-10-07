import { ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import Image from './image'
import IngredientTranslation from './ingredientTranslation'
import ProductIngredient from './productIngredients'

@Entity()
@ObjectType()
export default class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => Image, (image) => image.ingredient)
  image!: Image

  @OneToMany(() => IngredientTranslation, (translation) => translation.ingredient)
  translations!: IngredientTranslation[]

  @OneToMany(() => ProductIngredient, (product) => product.ingredient)
  products!: ProductIngredient[]

  @Column({ nullable: true })
  rating!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
