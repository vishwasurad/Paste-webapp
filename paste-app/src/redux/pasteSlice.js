import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:3000/api'; // or your deployed backend URL

// Helper function to handle API errors
const handleApiError = (error, response) => {
  if (response && !response.ok) {
    return `HTTP error! status: ${response.status} - ${response.statusText}`;
  }
  return error.message || 'An unexpected error occurred';
};

// Async thunk for creating a new paste (for Home.jsx)
export const createPaste = createAsyncThunk(
  'paste/createPaste',
  async (pasteData, { rejectWithValue }) => {
    try {
      console.log('Creating paste with data:', pasteData);
      const response = await fetch(`${API_BASE_URL}/pastes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Paste created successfully:', data);
      return data;
    } catch (error) {
      console.error('Create paste error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for fetching all pastes (for Home.jsx)
export const fetchAllPastes = createAsyncThunk(
  'paste/fetchAllPastes',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching all pastes...');
      const response = await fetch(`${API_BASE_URL}/pastes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("after thge response.json()",data);
      const arr=data.notes;
      // console.log("arr",arr);
  
      // const data1=Array.isArray(data) ? data : (data.pastes || []);
      // console.log('Fetched all pastes successfully:', data1);
      // Ensure we return an array
      return arr;
    } catch (error) {
      console.error('Fetch all pastes error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for fetching a single paste by ID (for ViewPaste.jsx and Paste1.jsx)
export const fetchPasteById = createAsyncThunk(
  'paste/fetchPasteById',
  async (pasteId, { rejectWithValue }) => {
    try {
      console.log('Fetching paste by ID:', pasteId);
      
      if (!pasteId) {
        throw new Error('Paste ID is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/pastes/search/${pasteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paste not found');
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched paste by ID successfully:', data);
      return data;
    } catch (error) {
      console.error('Fetch paste by ID error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for updating a paste (for Paste1.jsx)
export const updatePaste = createAsyncThunk(
  'paste/updatePaste',
  async ({ id, pasteData }, { rejectWithValue }) => {
    try {
      console.log('Updating paste:', id, pasteData);
      
      if (!id) {
        throw new Error('Paste ID is required for update');
      }
      
      const response = await fetch(`${API_BASE_URL}/pastes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pasteData),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paste not found');
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Paste updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Update paste error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for deleting a paste (for ViewPaste.jsx and Paste1.jsx)
export const deletePaste = createAsyncThunk(
  'paste/deletePaste',
  async (pasteId, { rejectWithValue }) => {
    try {
      console.log('Deleting paste:', pasteId);
      
      if (!pasteId) {
        throw new Error('Paste ID is required for deletion');
      }
      
      const response = await fetch(`${API_BASE_URL}/pastes/${pasteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // If paste is already deleted, consider it successful
          console.log('Paste already deleted or not found');
          return pasteId;
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      console.log('Paste deleted successfully');
      return pasteId; // Return the deleted paste ID
    } catch (error) {
      console.error('Delete paste error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async thunk for searching pastes (for Home.jsx if you have search functionality)
export const searchPastes = createAsyncThunk(
  'paste/searchPastes',
  async (searchTerm, { rejectWithValue }) => {
    try {
      console.log('Searching pastes with term:', searchTerm);
      
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Search term is required');
      }
      
      const response = await fetch(`${API_BASE_URL}/pastes/searchtitle/${encodeURIComponent(searchTerm.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Search completed successfully:', data);
      
      // Ensure we return an array
      return Array.isArray(data) ? data : (data.pastes || []);
    } catch (error) {
      console.error('Search pastes error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState = {
  pastes: [],
  currentPaste: null,
  filteredPastes: [],
  searchTerm: '',
  isLoading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  deleteLoading: false,
};

// Create the slice
const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    // Set current paste (for navigation between components)
    setCurrentPaste: (state, action) => {
      state.currentPaste = action.payload;
      state.error = null; // Clear any previous errors
    },
    
    // Clear current paste
    clearCurrentPaste: (state) => {
      state.currentPaste = null;
    },
    
    // Set search term (for Home.jsx filtering)
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      // Filter pastes based on search term
      if (action.payload.trim() === '') {
        state.filteredPastes = state.pastes;
      } else {
        const searchLower = action.payload.toLowerCase();
        state.filteredPastes = state.pastes.filter(paste => 
          (paste.title && paste.title.toLowerCase().includes(searchLower)) ||
          (paste.content && paste.content.toLowerCase().includes(searchLower))
        );
      }
    },
    
    // Reset search
    resetSearch: (state) => {
      state.searchTerm = '';
      state.filteredPastes = state.pastes;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    
    // Clear all loading states
    clearAllLoading: (state) => {
      state.isLoading = false;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
    },
    
    // Add paste locally (optimistic update)
    addPasteLocal: (state, action) => {
      if (action.payload && action.payload._id) {
        // Check if paste already exists to avoid duplicates
        const existingIndex = state.pastes.findIndex(paste => paste._id === action.payload._id);
        if (existingIndex === -1) {
          state.pastes.unshift(action.payload);
          state.filteredPastes = state.pastes;
        }
      }
    },
    
    // Update paste locally (optimistic update)
    updatePasteLocal: (state, action) => {
      if (action.payload && action.payload._id) {
        const index = state.pastes.findIndex(paste => paste._id === action.payload._id);
        if (index !== -1) {
          state.pastes[index] = action.payload;
          state.filteredPastes = state.pastes;
        }
        if (state.currentPaste && state.currentPaste._id === action.payload._id) {
          state.currentPaste = action.payload;
        }
      }
    },
    
    // Remove paste locally (optimistic update)
    removePasteLocal: (state, action) => {
      const pasteId = action.payload;
      state.pastes = state.pastes.filter(paste => paste._id !== pasteId);
      state.filteredPastes = state.pastes;
      if (state.currentPaste && state.currentPaste._id === pasteId) {
        state.currentPaste = null;
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Create paste
      .addCase(createPaste.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPaste.fulfilled, (state, action) => {
        state.createLoading = false;
        if (action.payload && action.payload._id) {
          // Check for duplicates before adding
          const existingIndex = state.pastes.findIndex(paste => paste._id === action.payload._id);
          if (existingIndex === -1) {
            state.pastes.unshift(action.payload);
            state.filteredPastes = state.pastes;
          }
        }
        state.createError = null;
      })
      .addCase(createPaste.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || 'Failed to create paste';
      })
      
      // Fetch all pastes
      .addCase(fetchAllPastes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPastes.fulfilled, (state, action) => {
        state.isLoading = false;
        const pastes = Array.isArray(action.payload) ? action.payload : [];
        state.pastes = pastes;
        state.filteredPastes = pastes;
        state.error = null;
      })
      .addCase(fetchAllPastes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch pastes';
        // Don't clear pastes on error, keep existing data
      })
      
      // Fetch paste by ID
      .addCase(fetchPasteById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPasteById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.currentPaste = action.payload;
          
          // Update the paste in pastes array if it exists
          const index = state.pastes.findIndex(paste => paste._id === action.payload._id);
          if (index !== -1) {
            state.pastes[index] = action.payload;
            state.filteredPastes = state.pastes;
          } else {
            // Add to pastes array if not present
            state.pastes.unshift(action.payload);
            state.filteredPastes = state.pastes;
          }
        }
        state.error = null;
      })
      .addCase(fetchPasteById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch paste';
        // Don't clear currentPaste immediately, let component handle it
      })
      
      // Update paste
      .addCase(updatePaste.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePaste.fulfilled, (state, action) => {
        state.updateLoading = false;
        if (action.payload) {
          state.currentPaste = action.payload;
          
          // Update the paste in pastes array
          const index = state.pastes.findIndex(paste => paste._id === action.payload._id);
          if (index !== -1) {
            state.pastes[index] = action.payload;
            state.filteredPastes = state.pastes;
          }
        }
        state.error = null;
      })
      .addCase(updatePaste.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || 'Failed to update paste';
      })
      
      // Delete paste
      .addCase(deletePaste.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePaste.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload;
        
        // Remove from pastes array
        state.pastes = state.pastes.filter(paste => paste._id !== deletedId);
        state.filteredPastes = state.pastes;
        
        // Clear current paste if it was deleted
        if (state.currentPaste && state.currentPaste._id === deletedId) {
          state.currentPaste = null;
        }
        
        state.error = null;
      })
      .addCase(deletePaste.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || 'Failed to delete paste';
      })
      
      // Search pastes
      .addCase(searchPastes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPastes.fulfilled, (state, action) => {
        state.isLoading = false;
        const results = Array.isArray(action.payload) ? action.payload : [];
        state.filteredPastes = results;
        state.error = null;
      })
      .addCase(searchPastes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search pastes';
      });
  },
});

// Export actions
export const { 
  setCurrentPaste, 
  clearCurrentPaste, 
  setSearchTerm,
  resetSearch,
  setLoading, 
  setError, 
  clearError,
  clearAllLoading,
  addPasteLocal,
  updatePasteLocal,
  removePasteLocal
} = pasteSlice.actions;

// Export selectors
export const selectAllPastes = (state) => state.paste.pastes;
export const selectFilteredPastes = (state) => state.paste.filteredPastes;
export const selectCurrentPaste = (state) => state.paste.currentPaste;
export const selectSearchTerm = (state) => state.paste.searchTerm;
export const selectIsLoading = (state) => state.paste.isLoading;
export const selectError = (state) => state.paste.error;
export const selectCreateLoading = (state) => state.paste.createLoading;
export const selectCreateError = (state) => state.paste.createError;
export const selectUpdateLoading = (state) => state.paste.updateLoading;
export const selectDeleteLoading = (state) => state.paste.deleteLoading;

// Export reducer
export default pasteSlice.reducer;