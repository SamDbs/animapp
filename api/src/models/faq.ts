import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import FaqTranslation from './faqTranslation'

@Entity()
export default class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => FaqTranslation, (translation) => translation.faq)
  translations!: FaqTranslation[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deteded_at' })
  deletedAt!: Date
}
