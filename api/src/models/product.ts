import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import Ingredient from './ingredient'

@Entity()
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  type!: string

  @Column()
  name!: string

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients!: Ingredient[]
}
