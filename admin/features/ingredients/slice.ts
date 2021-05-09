import { createSlice } from '@reduxjs/toolkit'

import { getIngredients } from './actions'

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    isLoading: false,
    ids: [] as any[],
    entities: {} as Record<string, any>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getIngredients.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.ids = payload.map((product: any) => product.id) as any[]
        state.entities = payload.reduce((r, x) => ({ ...r, [x['id']]: x }), {})
      })
      .addCase(getIngredients.rejected, (state, { payload }) => {
        state.isLoading = false
      })
  },
})

export default ingredientsSlice.reducer
