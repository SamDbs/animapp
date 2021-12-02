import { useQuery } from '@apollo/client'

import GET_FAQS from './query'

export type Faqs = { faq: Faq }[]
export type Faq = {
  id: string
  question: string
  answer: string
}

type QueryReturnType = {
  faqs: {
    id: string
    question: string
    answer: string
  }[]
}

type QueryVariables = { id: string }

export default function useGetFaqs() {
  return useQuery<QueryReturnType, QueryVariables>(GET_FAQS)
}
