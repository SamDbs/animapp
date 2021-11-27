import { gql } from '@apollo/client'

const ANALYZE_INGREDIENTS = gql`
  query SearchProducts($q: String!) {
    products(searchTerms: $q) {
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

export default ANALYZE_INGREDIENTS
