import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import type { AppState } from '../../stores'

export const getProducts = createAsyncThunk<
  any[],
  void,
  {
    state: AppState
  }
>('products/getList', async (_, { getState }) => {
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
>('products/search', async (params, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.get(`${process.env.API_URL}/products`, {
    headers: { Authorization: jwt },
    params,
  })

  return data
})

export const createProduct = createAsyncThunk<
  void,
  { barCode: string; name: string; type: string },
  {
    state: AppState
  }
>('products/create', async (params, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.post(`${process.env.API_URL}/products`, params, {
    headers: { Authorization: jwt },
  })
  return
})
