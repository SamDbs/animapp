import { gql } from '@apollo/client'

const GET_FAQ = gql`
  query GetFaq($id: String!) {
    faq(id: $id) {
      id
      question
      answer
    }
  }
`

export default GET_FAQ
