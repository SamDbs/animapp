import { ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import Ingredient from './ingredient'
import Product from './product'

@Entity()
@ObjectType()
export default class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToOne(() => Product, (product) => product.image)
  @JoinColumn({ name: 'productId' })
  product!: Product['id']
  @Column({ nullable: true })
  productId!: number

  @OneToOne(() => Ingredient, (ingredient) => ingredient.image)
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: Ingredient['id']
  @Column({ nullable: true })
  ingredientId!: number

  @Column({ type: 'bytea' })
  image!: Buffer

  @Column()
  url!: string

  @Column()
  type!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
