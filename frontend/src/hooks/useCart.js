import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addItemLocal,
  updateItemLocal,
  removeItemLocal,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector(state => state.cart);

  // Fetch cart
  const getCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Add item to cart
  const addToCartHandler = useCallback(async (productId, quantity, product) => {
    try {
      // Optimistic update
      dispatch(addItemLocal({ productId, quantity, product }));
      // Server update
      await dispatch(addToCart({ productId, quantity })).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(removeItemLocal(productId));
      throw error;
    }
  }, [dispatch]);

  // Update cart item
  const updateCartItemHandler = useCallback(async (itemId, quantity) => {
    try {
      // Optimistic update
      dispatch(updateItemLocal({ itemId, quantity }));
      // Server update
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateItemLocal({ itemId, quantity: items.find(item => item.id === itemId)?.quantity || 1 }));
      throw error;
    }
  }, [dispatch, items]);

  // Remove item from cart
  const removeFromCartHandler = useCallback(async (itemId) => {
    try {
      // Optimistic update
      dispatch(removeItemLocal(itemId));
      // Server update
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(addItemLocal({ itemId, quantity: items.find(item => item.id === itemId)?.quantity || 1 }));
      throw error;
    }
  }, [dispatch, items]);

  // Clear cart
  const clearCartHandler = useCallback(async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Get item count
  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Check if product is in cart
  const isProductInCart = useCallback((productId) => {
    return items.some(item => item.productId === productId);
  }, [items]);

  // Get item quantity
  const getItemQuantity = useCallback((productId) => {
    const item = items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [items]);

  return {
    items,
    total,
    loading,
    error,
    getCart,
    addToCart: addToCartHandler,
    updateCartItem: updateCartItemHandler,
    removeFromCart: removeFromCartHandler,
    clearCart: clearCartHandler,
    getItemCount,
    isProductInCart,
    getItemQuantity,
  };
};
