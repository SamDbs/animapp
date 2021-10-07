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
import Product from './product'

@Entity()
@ObjectType()
export default class ProductIngredient extends BaseEntity {
  @PrimaryColumn()
  productId!: number

  @PrimaryColumn()
  ingredientId!: number

  @Column({ nullable: true })
  quantity!: string

  @Column({ default: 0 })
  order!: number

  @ManyToOne(() => Product, (product) => product.ingredients)
  @JoinColumn({ name: 'productId' })
  product!: Product

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.products)
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null
}
