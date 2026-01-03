import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import dropsReducer from './slices/dropsSlice';
import brandsReducer from './slices/brandsSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';
import favoritesReducer from './slices/favoritesSlice';
import wishlistReducer from './slices/wishlistSlice';
import comparisonReducer from './slices/comparisonSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    drops: dropsReducer,
    brands: brandsReducer,
    products: productsReducer,
    orders: ordersReducer,
    favorites: favoritesReducer,
    wishlist: wishlistReducer,
    comparison: comparisonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
