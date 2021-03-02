import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export default class Language extends BaseEntity {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string
}
