import { ProductType } from '@hooks/stores/product'

const enumStrings = {
  ProductType: {
    [ProductType.DRY_FOOD]: 'dry food',
    [ProductType.TREATS]: 'treats',
    [ProductType.WET_FOOD]: 'wet food',
  },
}

export default enumStrings
