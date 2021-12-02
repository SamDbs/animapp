import { gql } from '@apollo/client'

const GET_FAQS = gql`
  query GetFaqs {
    faqs {
      id
      question
      answer
    }
  }
`

export default GET_FAQS
