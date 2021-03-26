import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import Faq from './faq'
import Language from './language'

@Entity()
export default class FaqTranslation extends BaseEntity {
  @PrimaryColumn()
  faqId!: number

  @PrimaryColumn()
  languageId!: string

  @Column()
  question!: string

  @Column()
  answer!: string

  @ManyToOne(() => Faq, (faq) => faq.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faqId' })
  public faq!: Faq

  @ManyToOne(() => Language, (language) => language.faqTranslations)
  @JoinColumn({ name: 'languageId' })
  public language!: Language

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
