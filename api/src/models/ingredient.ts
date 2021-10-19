import { Field, ID, ObjectType } from 'type-graphql'
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
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => Image, (image) => image.ingredient)
  image!: Image

  @OneToMany(() => IngredientTranslation, (translation) => translation.ingredient)
  translations!: IngredientTranslation[]

  @OneToMany(() => ProductIngredient, (product) => product.ingredient)
  products!: ProductIngredient[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  rating!: number

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
