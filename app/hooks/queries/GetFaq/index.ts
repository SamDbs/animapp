import { useQuery } from '@apollo/client'

import GET_FAQ from './query'

export type Faqs = { faq: Faq }[]
export type Faq = {
  id: string
  question: string
  answer: string
}

type QueryReturnType = {
  faq: {
    id: string
    question: string
    answer: string
  }
}

type QueryVariables = { id: string }

export default function useGetFaq(id: string) {
  return useQuery<QueryReturnType, QueryVariables>(GET_FAQ, { variables: { id } })
}
