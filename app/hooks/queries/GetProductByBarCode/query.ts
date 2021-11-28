import { gql } from '@apollo/client'

const GET_PRODUCT = gql`
  query GetProduct($barCode: String!) {
    product(barCode: $barCode) {
      id
      description
      image
      name
      type
      ingredients {
        ingredient {
          id
          name
          review
          description
          rating
        }
      }
    }
  }
`

export default GET_PRODUCT
