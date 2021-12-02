import { gql } from '@apollo/client'

const ANALYZE_INGREDIENTS = gql`
  query AnalyzeIngredients($q: String!) {
    analyzeIngredients(q: $q) {
      ingredientSearched
      ingredientFound {
        id
        name
        review
      }
    }
  }
`

export default ANALYZE_INGREDIENTS
