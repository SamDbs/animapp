import { gql } from '@apollo/client'

const query = gql`
  query GetProductFromHistory($id: ID!) {
    product(id: $id) {
      id
      image
      name
      brand {
        id
        name
      }
    }
  }
`

export default query
