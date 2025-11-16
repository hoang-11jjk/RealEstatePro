import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type FiltersState = {
  keyword: string
  location: string
  type: string
  status: string
  minPrice: string
  maxPrice: string
}

const initialState: FiltersState = {
  keyword: '',
  location: '',
  type: '',
  status: '',
  minPrice: '',
  maxPrice: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ field: keyof FiltersState; value: string }>) {
      state[action.payload.field] = action.payload.value
    },
    clearFilters() {
      return initialState
    },
  },
})

export const { setFilter, clearFilters } = filtersSlice.actions
export default filtersSlice.reducer
