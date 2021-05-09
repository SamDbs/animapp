import { configureStore } from '@reduxjs/toolkit'

import auth from '../features/auth/slice'
import products from '../features/products/slice'
import ingredients from '../features/ingredients/slice'


const store = configureStore({
  reducer: { auth, products, ingredients },
  devTools: true,
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
