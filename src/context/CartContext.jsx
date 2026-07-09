import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) return;
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (foodId, quantity = 1, notes = '') => {
    const res = await addToCart(foodId, quantity, notes);
    setCart(res.data.data);
    return res.data.data;
  };

  const updateItem = async (cartItemId, quantity) => {
    const res = await updateCartItem(cartItemId, quantity);
    setCart(res.data.data);
    return res.data.data;
  };

  const removeItem = async (cartItemId) => {
    const res = await removeCartItem(cartItemId);
    setCart(res.data.data);
    return res.data.data;
  };

  const emptyCart = async () => {
    await clearCart();
    setCart(prev => prev ? { ...prev, items: [] } : null);
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartSubtotal = cart?.items?.reduce(
    (sum, item) => sum + item.food.price * item.quantity, 0
  ) || 0;

  const getItemQuantity = (foodId) => {
    const item = cart?.items?.find(i => i.food.id === foodId);
    return item ? item.quantity : 0;
  };

  const getCartItemId = (foodId) => {
    return cart?.items?.find(i => i.food.id === foodId)?.id || null;
  };

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart,
      addItem, updateItem, removeItem, emptyCart,
      cartCount, cartSubtotal, getItemQuantity, getCartItemId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
