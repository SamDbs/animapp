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
        quantity
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
          id
          name
          description
        }
      }
    }
  }
`

export default GET_PRODUCT
