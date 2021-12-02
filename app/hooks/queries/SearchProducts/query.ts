import { gql } from '@apollo/client'

const SEARCH_PRODUCTS = gql`
  query SearchProducts($q: String!) {
    products(searchTerms: $q, filters: { published: true }) {
      id
      name
      description
      image
      brand {
        id
        name
      }
    }
  }
`

export default SEARCH_PRODUCTS
