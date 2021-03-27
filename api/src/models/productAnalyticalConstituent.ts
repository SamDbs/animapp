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
export default class ProductAnalyticalConstituent extends BaseEntity {
  @PrimaryColumn()
  productId!: number

  @PrimaryColumn()
  analyticalConstituentId!: number

  @Column({ type: 'float' })
  quantity!: number

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
  deletedAt!: Date
}
