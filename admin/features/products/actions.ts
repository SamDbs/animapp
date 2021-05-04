import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import type { AppState } from '../../stores'

export const getProducts = createAsyncThunk<
  any[],
  void,
  {
    state: AppState
  }
>('products', async (_, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.get(`${process.env.API_URL}/products`, {
    headers: { Authorization: jwt },
  })

  return data
})

export const searchProducts = createAsyncThunk<
  any[],
  Record<string, string>,
  {
    state: AppState
  }
>('products', async (params, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.get(`${process.env.API_URL}/products`, {
    headers: { Authorization: jwt },
    params,
  })

  return data
})
