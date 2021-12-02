import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import ProductAnalyticalConstituent from './productAnalyticalConstituent'
import ConstituentTranslation from './constituentTranslation'

@Entity()
@ObjectType()
export default class AnalyticalConstituent extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(
    () => ProductAnalyticalConstituent,
    (productAnalyticalConstituent) => productAnalyticalConstituent.analyticalConstituent,
  )
  products!: ProductAnalyticalConstituent[]

  @OneToMany(() => ConstituentTranslation, (translation) => translation.analyticalConstituent)
  translations!: ConstituentTranslation[]

  @Field()
  @CreateDateColumn()
  createdAt!: Date

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date | null
}
