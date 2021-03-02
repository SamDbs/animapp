import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import Ingredient from './ingredient'
import ProductDescriptionTranslation from './productDescriptionTranslation'

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  type!: string

  @Column()
  name!: string

  @OneToMany(() => ProductDescriptionTranslation, (description) => description.product)
  descriptionTranslations!: ProductDescriptionTranslation[]

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients!: Ingredient[]
}
