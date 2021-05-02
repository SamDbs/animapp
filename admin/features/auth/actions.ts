import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type AuthLoginParams = { login: string; password: string }

export const login = createAsyncThunk<string, AuthLoginParams>(
  'auth/login',
  async ({ login, password }) => {
    const { data } = await axios.post('https://animapp-v2.herokuapp.com/auth', { login, password })
    const { jwt } = data
    return jwt
  },
)
