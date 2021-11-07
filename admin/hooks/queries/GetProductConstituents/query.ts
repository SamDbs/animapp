import { gql } from '@apollo/client'

const GET_PRODUCT_CONSTITUENTS = gql`
  query GetProductAnalyticalConstituents($productId: String!) {
    productConstituents(productId: $productId) {
      quantity
      constituent {
        description
        id
        name
      }
    }
  }
`

export default GET_PRODUCT_CONSTITUENTS
