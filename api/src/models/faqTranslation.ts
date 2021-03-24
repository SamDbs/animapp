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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deteded_at' })
  deletedAt!: Date
}
