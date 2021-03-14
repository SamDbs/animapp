import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

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
}
