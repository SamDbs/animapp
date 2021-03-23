import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import Product from './product'

@Entity()
export default class Brand extends BaseEntity {
  @PrimaryColumn()
  id!: number

  @Column()
  name!: string

  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[]
}
