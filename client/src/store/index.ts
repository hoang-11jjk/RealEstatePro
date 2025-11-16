import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import filtersReducer from './filtersSlice'
import listingsReducer from './listingsSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    filters: filtersReducer,
    auth: authReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
