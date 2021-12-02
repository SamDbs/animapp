import { gql } from '@apollo/client'

const CREATE_INGREDIENT = gql`
  mutation CreateIngredient {
    createIngredient {
      id
    }
  }
`

export default CREATE_INGREDIENT
