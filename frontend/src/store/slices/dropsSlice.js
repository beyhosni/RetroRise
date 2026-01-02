import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchDrops = createAsyncThunk(
  'drops/fetchDrops',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.getDrops(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch drops' });
    }
  }
);

export const fetchDrop = createAsyncThunk(
  'drops/fetchDrop',
  async (dropId, { rejectWithValue }) => {
    try {
      const response = await api.getDrop(dropId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch drop' });
    }
  }
);

export const fetchActiveDrops = createAsyncThunk(
  'drops/fetchActiveDrops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getActiveDrops();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch active drops' });
    }
  }
);

export const fetchUpcomingDrops = createAsyncThunk(
  'drops/fetchUpcomingDrops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUpcomingDrops();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch upcoming drops' });
    }
  }
);

export const createDrop = createAsyncThunk(
  'drops/createDrop',
  async (dropData, { rejectWithValue }) => {
    try {
      const response = await api.createDrop(dropData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create drop' });
    }
  }
);

export const updateDrop = createAsyncThunk(
  'drops/updateDrop',
  async ({ dropId, dropData }, { rejectWithValue }) => {
    try {
      const response = await api.updateDrop(dropId, dropData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update drop' });
    }
  }
);

export const deleteDrop = createAsyncThunk(
  'drops/deleteDrop',
  async (dropId, { rejectWithValue }) => {
    try {
      await api.deleteDrop(dropId);
      return dropId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete drop' });
    }
  }
);

// Initial state
const initialState = {
  drops: [],
  activeDrops: [],
  upcomingDrops: [],
  currentDrop: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
};

// Drops slice
const dropsSlice = createSlice({
  name: 'drops',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDrop: (state) => {
      state.currentDrop = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch drops
    builder
      .addCase(fetchDrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrops.fulfilled, (state, action) => {
        state.loading = false;
        state.drops = action.payload.items || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchDrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch drops';
      });

    // Fetch single drop
    builder
      .addCase(fetchDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDrop = action.payload;
      })
      .addCase(fetchDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch drop';
      });

    // Fetch active drops
    builder
      .addCase(fetchActiveDrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveDrops.fulfilled, (state, action) => {
        state.loading = false;
        state.activeDrops = action.payload.items || [];
      })
      .addCase(fetchActiveDrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch active drops';
      });

    // Fetch upcoming drops
    builder
      .addCase(fetchUpcomingDrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingDrops.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingDrops = action.payload.items || [];
      })
      .addCase(fetchUpcomingDrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch upcoming drops';
      });

    // Create drop
    builder
      .addCase(createDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.drops.unshift(action.payload);
      })
      .addCase(createDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create drop';
      });

    // Update drop
    builder
      .addCase(updateDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDrop.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.drops.findIndex(drop => drop.id === action.payload.id);
        if (index !== -1) {
          state.drops[index] = action.payload;
        }
        if (state.currentDrop?.id === action.payload.id) {
          state.currentDrop = action.payload;
        }
      })
      .addCase(updateDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update drop';
      });

    // Delete drop
    builder
      .addCase(deleteDrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDrop.fulfilled, (state, action) => {
        state.loading = false;
        state.drops = state.drops.filter(drop => drop.id !== action.payload);
        state.activeDrops = state.activeDrops.filter(drop => drop.id !== action.payload);
        state.upcomingDrops = state.upcomingDrops.filter(drop => drop.id !== action.payload);
        if (state.currentDrop?.id === action.payload) {
          state.currentDrop = null;
        }
      })
      .addCase(deleteDrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete drop';
      });
  },
});

export const { clearError, clearCurrentDrop } = dropsSlice.actions;
export default dropsSlice.reducer;
