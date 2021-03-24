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
  public product!: Product

  @ManyToOne(() => Language, (language) => language.productTranslations)
  @JoinColumn({ name: 'languageId' })
  public language!: Language

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deteded_at' })
  deletedAt!: Date
}
