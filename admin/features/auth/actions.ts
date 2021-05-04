import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthLoginParams = { login: string; password: string }

export const login = createAsyncThunk<string, AuthLoginParams>(
  'auth/login',
  async ({ login, password }) => {
    const { data } = await axios.post(`${process.env.API_URL}/auth`, { login, password })
    const { jwt } = data

    await AsyncStorage.setItem('jwt', jwt)

    return jwt
  },
)
