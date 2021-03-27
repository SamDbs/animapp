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

import Language from './language'
import AnalyticalConstituent from './analyticalConstituent'

@Entity()
export default class ConstituentTranslation extends BaseEntity {
  @PrimaryColumn()
  analyticalConstituentId!: number

  @PrimaryColumn()
  languageId!: string

  @Column()
  name!: string

  @Column()
  description!: string

  @ManyToOne(
    () => AnalyticalConstituent,
    (analyticalConstituent) => analyticalConstituent.translations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'analyticalConstituentId' })
  analyticalConstituent!: AnalyticalConstituent

  @ManyToOne(() => Language, (language) => language.constituentTranslations)
  @JoinColumn({ name: 'languageId' })
  language!: Language

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
