import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import Ingredient from './ingredient'
import Brand from './brand'
import ProductTranslation from './productTranslation'

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  type!: string

  @Column()
  name!: string

  @Column({ nullable: true })
  photo!: string

  @Column()
  brandId!: number

  @OneToMany(() => ProductTranslation, (translation) => translation.product)
  translations!: ProductTranslation[]

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products)
  @JoinTable()
  ingredients!: Ingredient[]

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  public brand!: Brand[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
