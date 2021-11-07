import { gql } from '@apollo/client'

const GET_PRODUCT_INGREDIENTS = gql`
  query GetProductIngredients($productId: String!) {
    productIngredients(productId: $productId) {
      quantity
      order
      ingredient {
        description
        id
        name
        review
      }
    }
  }
`

export default GET_PRODUCT_INGREDIENTS
