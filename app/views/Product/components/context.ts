import { createContext } from 'react'

const IngredientModalContext = createContext<{ ingredientId: string | null; open: any }>({
  ingredientId: null,
  open: (id: string) => null,
})

export default IngredientModalContext
