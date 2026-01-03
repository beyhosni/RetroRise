
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des favoris');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/favorites/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l'ajout aux favoris');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (productId, { rejectWithValue }) => {
    try {
      await api.delete(`/favorites/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression des favoris');
    }
  }
);

export const clearFavorites = createAsyncThunk(
  'favorites/clearFavorites',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/favorites');
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression des favoris');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to favorites
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.items.some(item => item.id === action.payload.id)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from favorites
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear favorites
      .addCase(clearFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearFavorites.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
