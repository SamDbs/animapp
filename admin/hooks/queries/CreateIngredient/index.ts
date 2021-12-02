import { useMutation } from '@apollo/client'

import CREATE_INGREDIENT from './mutation'

type MutationReturnType = { createIngredient: { id: string } }

type MutationVariables = never

export default function useCreateIngredient() {
  return useMutation<MutationReturnType, MutationVariables>(CREATE_INGREDIENT)
}
