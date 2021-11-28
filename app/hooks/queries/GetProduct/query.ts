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
    }
  }
`

export default GET_PRODUCT
