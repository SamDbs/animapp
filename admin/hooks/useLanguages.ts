import { gql, useQuery } from '@apollo/client'

type Language = { id: string; name: string }

const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      id
      name
    }
  }
`

export default function useLanguages() {
  const { data } = useQuery<{ languages: Language[] }>(GET_LANGUAGES)

  return data?.languages
}
