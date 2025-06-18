import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// API base URL - adjust according to your backend
const API_BASE_URL = 'http://localhost:3000/api' // Change this to your backend URL

// Async thunks for API calls
export const fetchAllPastes = createAsyncThunk(
  'paste/fetchAllPastes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes`)
      if (!response.ok) {
        throw new Error('Failed to fetch pastes')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPaste = createAsyncThunk(
  'paste/createPaste',
  async (pasteData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData)
      })
      if (!response.ok) {
        throw new Error('Failed to create paste')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePaste = createAsyncThunk(
  'paste/updatePaste',
  async ({ id, pasteData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData)
      })
      if (!response.ok) {
        throw new Error('Failed to update paste')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deletePaste = createAsyncThunk(
  'paste/deletePaste',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete paste')
      }
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const searchPastes = createAsyncThunk(
  'paste/searchPastes', 
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pastes/searchtitle/${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error('Failed to search pastes')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }  
  }
)

const initialState = {
  pastes: [],
  searchResults: [],
  isAllPastes: true,
  loading: false,
  error: null
}

const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    // Keep any synchronous actions you might need
    resetSearchResults: (state) => {
      state.searchResults = []
      state.isAllPastes = true
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pastes
      .addCase(fetchAllPastes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPastes.fulfilled, (state, action) => {
        state.loading = false
        state.pastes = action.payload
        state.isAllPastes = true
      })
      .addCase(fetchAllPastes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create paste
      .addCase(createPaste.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPaste.fulfilled, (state, action) => {
        state.loading = false
        state.pastes.push(action.payload)
      })
      .addCase(createPaste.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update paste
      .addCase(updatePaste.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaste.fulfilled, (state, action) => {
        state.loading = false
        const index = state.pastes.findIndex(paste => paste._id === action.payload._id)
        if (index !== -1) {
          state.pastes[index] = action.payload
        }
      })
      .addCase(updatePaste.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete paste
      .addCase(deletePaste.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePaste.fulfilled, (state, action) => {
        state.loading = false
        state.pastes = state.pastes.filter(paste => paste._id !== action.payload)
      })
      .addCase(deletePaste.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Search pastes
      .addCase(searchPastes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchPastes.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
        state.isAllPastes = false
      })
      .addCase(searchPastes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { resetSearchResults, clearError } = pasteSlice.actions
export default pasteSlice.reducer