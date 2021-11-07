import { gql } from '@apollo/client'

const CREATE_INGREDIENT = gql`
  mutation CreateConstituent {
    createConstituent {
      id
    }
  }
`

export default CREATE_INGREDIENT
