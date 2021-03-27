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
export default class AnalyticalConstituent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(
    () => ProductAnalyticalConstituent,
    (productAnalyticalConstituent) => productAnalyticalConstituent.analyticalConstituent,
  )
  products!: ProductAnalyticalConstituent[]

  @OneToMany(() => ConstituentTranslation, (translation) => translation.analyticalConstituent)
  translations!: ConstituentTranslation[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
