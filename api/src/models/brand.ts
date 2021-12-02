import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import Product from './product'

@Entity()
@ObjectType()
@Unique('UQ_NAME', ['name'])
export default class Brand extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deletedAt!: Date | null

  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[]
}
