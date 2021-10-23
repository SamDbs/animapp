import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import ProductAnalyticalConstituent from './productAnalyticalConstituent'

@Entity()
@ObjectType()
export default class AnalyticalConstituent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(
    () => ProductAnalyticalConstituent,
    (productAnalyticalConstituent) => productAnalyticalConstituent.analyticalConstituent,
  )
  products!: ProductAnalyticalConstituent[]

  @Field()
  @Column()
  name!: string

  @Field()
  @Column()
  description!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
