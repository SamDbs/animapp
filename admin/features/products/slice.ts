import { createSlice } from '@reduxjs/toolkit'

import { getProducts } from './actions'

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    isLoading: false,
    ids: [] as any[],
    entities: {} as Record<string, any>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.ids = payload.map((product: any) => product.id) as any[]
        state.entities = payload.reduce((r, x) => ({ ...r, [x['id']]: x }), {})
      })
      .addCase(getProducts.rejected, (state, { payload }) => {
        state.isLoading = false
      })
  },
})

export default productsSlice.reducer
