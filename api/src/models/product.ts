import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import Brand from './brand'
import Image from './image'
import ProductAnalyticalConstituent from './productAnalyticalConstituent'
import ProductIngredient from './productIngredients'
import ProductTranslation from './productTranslation'

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  type!: string

  @Column()
  name!: string

  @OneToOne(() => Image, (image) => image.product)
  image?: Image

  @Column()
  barCode!: string

  @Column()
  brandId!: number

  @OneToMany(
    () => ProductAnalyticalConstituent,
    (productAnalyticalConstituent) => productAnalyticalConstituent.product,
  )
  analyticalConstituents!: ProductAnalyticalConstituent[]

  @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.product)
  ingredients!: ProductAnalyticalConstituent[]

  @OneToMany(() => ProductTranslation, (translation) => translation.product)
  translations!: ProductTranslation[]

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand!: Brand

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
