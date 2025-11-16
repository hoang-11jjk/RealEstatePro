import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { api } from '../api'
import type { ListingDraft, Property } from '../types'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

type ListingsState = {
  items: Property[]
  selectedId: number | null
  status: Status
  createStatus: Status
  error: string | null
}

const initialState: ListingsState = {
  items: [],
  selectedId: null,
  status: 'idle',
  createStatus: 'idle',
  error: null,
}

export const fetchListings = createAsyncThunk<Property[]>('listings/fetchAll', async () => {
  const response = await api.get<Property[]>('/properties')
  return response.data
})

export const createListing = createAsyncThunk<Property, ListingDraft>(
  'listings/create',
  async (payload) => {
    const response = await api.post<Property>('/properties', payload)
    return response.data
  },
)

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    selectProperty(state, action: PayloadAction<number>) {
      state.selectedId = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.selectedId = action.payload[0]?.id ?? null
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Không thể tải danh sách tin'
      })
      .addCase(createListing.pending, (state) => {
        state.createStatus = 'loading'
        state.error = null
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.items = [action.payload, ...state.items]
        state.selectedId = action.payload.id
      })
      .addCase(createListing.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.error.message ?? 'Không thể tạo tin'
      })
  },
})

export const { selectProperty } = listingsSlice.actions
export default listingsSlice.reducer
