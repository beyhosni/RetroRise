
import { createSlice } from '@reduxjs/toolkit';

const loadComparisonFromStorage = () => {
  try {
    const savedComparison = localStorage.getItem('retrorise_comparison');
    return savedComparison ? JSON.parse(savedComparison) : [];
  } catch (error) {
    console.error('Error loading comparison from storage:', error);
    return [];
  }
};

const saveComparisonToStorage = (items) => {
  try {
    localStorage.setItem('retrorise_comparison', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving comparison to storage:', error);
  }
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    items: loadComparisonFromStorage(),
    maxItems: 4,
  },
  reducers: {
    addToComparison: (state, action) => {
      const product = action.payload;

      // Check if product already in comparison
      if (state.items.some(item => item.id === product.id)) {
        return;
      }

      // Check if max items reached
      if (state.items.length >= state.maxItems) {
        return;
      }

      state.items.push(product);
      saveComparisonToStorage(state.items);
    },
    removeFromComparison: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveComparisonToStorage(state.items);
    },
    clearComparison: (state) => {
      state.items = [];
      saveComparisonToStorage([]);
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;
