import { createSlice } from '@reduxjs/toolkit'

import { login } from './actions'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    jwt: '',
  },
  reducers: {},
  extraReducers: {
    [login.pending.type]: (state) => {
      state.isLoading = true
    },
    [login.fulfilled.type]: (state, { payload }) => {
      state.isLoading = false
      state.jwt = payload
    },
    [login.rejected.type]: (state, { payload }) => {
      state.isLoading = false
      state.jwt = ''
    },
  },
})

export default authSlice.reducer
