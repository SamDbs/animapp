import { useMutation } from '@apollo/client'

import CREATE_CONSTITUENT from './mutation'

type MutationReturnType = { createConstituent: { id: string } }

type MutationVariables = never

export default function useCreateConstituent() {
  return useMutation<MutationReturnType, MutationVariables>(CREATE_CONSTITUENT)
}
