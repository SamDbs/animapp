import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import type { AppState } from '../../stores'

export const getIngredients = createAsyncThunk<
  any[],
  void,
  {
    state: AppState
  }
>('ingredients', async (_, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.get(`${process.env.API_URL}/ingredients`, {
    headers: { Authorization: jwt },
  })

  return data
})

export const searchIngredients = createAsyncThunk<
  any[],
  Record<string, string>,
  {
    state: AppState
  }
>('ingredients', async (params, { getState }) => {
  const { jwt } = getState().auth
  const { data } = await axios.get(`${process.env.API_URL}/ingredients`, {
    headers: { Authorization: jwt },
    params,
  })

  return data
})
