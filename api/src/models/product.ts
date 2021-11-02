import { Field, ID, ObjectType } from 'type-graphql'
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
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import Brand from './brand'
import Image from './image'
import ProductAnalyticalConstituent from './productAnalyticalConstituent'
import ProductIngredient from './productIngredients'
import ProductTranslation from './productTranslation'

export enum ProductType {
  DRY_FOOD = 'DRY_FOOD',
  TREATS = 'TREATS',
  WET_FOOD = 'WET_FOOD',
}

@Entity()
@ObjectType()
@Unique('UQ_NAME', ['name'])
export default class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({ type: 'enum', enum: ProductType, default: ProductType.DRY_FOOD })
  type!: ProductType

  @Field()
  @Column()
  name!: string

  @OneToOne(() => Image, (image) => image.product)
  image?: Image

  @Field()
  @Column()
  barCode!: string

  @Field()
  @Column({ default: false })
  published!: boolean

  @Field(() => String)
  @Column()
  brandId!: number

  @OneToMany(
    () => ProductAnalyticalConstituent,
    (productAnalyticalConstituent) => productAnalyticalConstituent.product,
  )
  analyticalConstituents!: ProductAnalyticalConstituent[]

  @Field(() => [ProductIngredient])
  @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.product)
  ingredients!: ProductIngredient[]

  @OneToMany(() => ProductTranslation, (translation) => translation.product)
  translations!: ProductTranslation[]

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brandId' })
  brand!: Brand

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @Field()
  @DeleteDateColumn()
  deletedAt!: Date
}
