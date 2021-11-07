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

import AnalyticalConstituent from './analyticalConstituent'
import Product from './product'

@Entity()
@ObjectType()
export default class ProductAnalyticalConstituent extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  productId!: number

  @Field(() => ID)
  @PrimaryColumn()
  analyticalConstituentId!: number

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  quantity!: string | null

  @ManyToOne(() => Product, (product) => product.analyticalConstituents)
  @JoinColumn({ name: 'productId' })
  product!: Product

  @ManyToOne(() => AnalyticalConstituent, (analyticalConstituent) => analyticalConstituent.products)
  @JoinColumn({ name: 'analyticalConstituentId' })
  analyticalConstituent!: AnalyticalConstituent

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null
}
