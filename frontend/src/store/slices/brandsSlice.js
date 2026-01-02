import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.getBrands(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch brands' });
    }
  }
);

export const fetchBrand = createAsyncThunk(
  'brands/fetchBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await api.getBrand(brandId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch brand' });
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await api.createBrand(brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create brand' });
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ brandId, brandData }, { rejectWithValue }) => {
    try {
      const response = await api.updateBrand(brandId, brandData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update brand' });
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      await api.deleteBrand(brandId);
      return brandId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete brand' });
    }
  }
);

// Initial state
const initialState = {
  brands: [],
  currentBrand: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  },
};

// Brands slice
const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.items || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 20,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 1,
        };
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch brands';
      });

    // Fetch single brand
    builder
      .addCase(fetchBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch brand';
      });

    // Create brand
    builder
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.unshift(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create brand';
      });

    // Update brand
    builder
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.currentBrand?.id === action.payload.id) {
          state.currentBrand = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update brand';
      });

    // Delete brand
    builder
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
        if (state.currentBrand?.id === action.payload) {
          state.currentBrand = null;
        }
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete brand';
      });
  },
});

export const { clearError, clearCurrentBrand } = brandsSlice.actions;
export default brandsSlice.reducer;
