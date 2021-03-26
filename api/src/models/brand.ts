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

import Product from './product'

@Entity()
export default class Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date

  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[]
}
