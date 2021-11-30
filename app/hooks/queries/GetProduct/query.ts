import { gql } from '@apollo/client'

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id, filters: { published: true }) {
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
      constituents {
        quantity
        constituent {
          name
          description
        }
      }
    }
  }
`

export default GET_PRODUCT
