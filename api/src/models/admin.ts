import { ObjectType } from 'type-graphql'
import { genSalt, hash } from 'bcryptjs'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export default class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  login!: string

  @Column()
  password!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date

  async setPassword(password: string): Promise<void> {
    const salt = await genSalt()
    this.password = await hash(password, salt)
    await this.save()
  }
}
