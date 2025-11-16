import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type User = {
  fullName: string
  email: string
}

type AuthState = {
  mode: 'login' | 'register'
  user: User | null
}

const initialState: AuthState = {
  mode: 'login',
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<'login' | 'register'>) {
      state.mode = action.payload
    },
    login(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.mode = 'login'
    },
  },
})

export const { setMode, login, logout } = authSlice.actions
export default authSlice.reducer
