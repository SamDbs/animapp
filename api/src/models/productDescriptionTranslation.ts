import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import Product from './product'
import Language from './language'

@Entity()
export default class productDescriptionTranslation extends BaseEntity {
  @PrimaryColumn()
  productId!: number

  @PrimaryColumn()
  languageId!: string

  @Column()
  text!: string

  @ManyToOne(() => Product, (product) => product.descriptionTranslations)
  @JoinColumn({ name: 'productId' })
  public product!: Product

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'languageId' })
  public language!: Language
}
