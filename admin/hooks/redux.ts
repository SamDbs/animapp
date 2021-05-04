import {
  TypedUseSelectorHook,
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector,
} from 'react-redux'
import type { AppState, AppDispatch } from '../stores'

export const useDispatch = () => useDefaultDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<AppState> = useDefaultSelector
