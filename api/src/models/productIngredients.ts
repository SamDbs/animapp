import { Field, ID, ObjectType } from 'type-graphql'
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
import Product from './product'

@Entity()
@ObjectType()
export default class ProductIngredient extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  productId!: number

  @Field(() => ID)
  @PrimaryColumn()
  ingredientId!: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  quantity!: string

  @Field({ defaultValue: 0 })
  @Column({ default: 0 })
  order!: number

  @ManyToOne(() => Product, (product) => product.ingredients)
  @JoinColumn({ name: 'productId' })
  product!: Product

  @Field(() => Ingredient)
  @ManyToOne(() => Ingredient, (ingredient) => ingredient.products)
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient

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
