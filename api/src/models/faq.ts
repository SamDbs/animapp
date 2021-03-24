import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import FaqTranslation from './faqTranslation'

@Entity()
export default class Faq extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => FaqTranslation, (translation) => translation.faq)
  translations!: FaqTranslation[]
}
