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

import Product from './product'
import Language from './language'

@Entity()
export default class ProductTranslation extends BaseEntity {
  @PrimaryColumn()
  productId!: number

  @PrimaryColumn()
  languageId!: string

  @Column()
  description!: string

  @ManyToOne(() => Product, (product) => product.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product

  @ManyToOne(() => Language, (language) => language.productTranslations)
  @JoinColumn({ name: 'languageId' })
  language!: Language

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
