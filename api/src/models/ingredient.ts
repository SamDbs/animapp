import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export default class Ingredient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number
}
