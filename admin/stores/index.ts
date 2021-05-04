import { configureStore } from '@reduxjs/toolkit'

import auth from '../features/auth/slice'
import products from '../features/products/slice'

const store = configureStore({
  reducer: { auth, products },
  devTools: true,
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
