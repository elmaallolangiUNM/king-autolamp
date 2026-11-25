'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Cart, CartItem } from '@/types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product_id: string; variant_id?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: string; variant_id?: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.findIndex(
        (i) =>
          i.product_id === action.payload.product_id &&
          i.variant_id === action.payload.variant_id
      );
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + action.payload.quantity,
        };
        return { items: updated };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) =>
            !(
              i.product_id === action.payload.product_id &&
              i.variant_id === action.payload.variant_id
            )
        ),
      };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(
                i.product_id === action.payload.product_id &&
                i.variant_id === action.payload.variant_id
              )
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product_id === action.payload.product_id &&
          i.variant_id === action.payload.variant_id
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextValue {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, variant_id?: string) => void;
  updateQuantity: (product_id: string, quantity: number, variant_id?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lumora_cart');
      if (saved) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('lumora_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (product_id: string, variant_id?: string) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { product_id, variant_id } });
  const updateQuantity = (product_id: string, quantity: number, variant_id?: string) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id, variant_id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
