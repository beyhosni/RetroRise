import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import dropsReducer from './slices/dropsSlice';
import brandsReducer from './slices/brandsSlice';
import productsReducer from './slices/productsSlice';
import ordersReducer from './slices/ordersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    drops: dropsReducer,
    brands: brandsReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
